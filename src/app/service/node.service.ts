import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpService} from './util/http.service';
import {map, shareReplay, tap} from 'rxjs/operators';
import {ViewService} from './util/view.service';
import {User} from './user.service';
import {Filter} from './util/filter';
import {Node} from './util/node';

class InputWrap {
  node: Node;
  tags: number[];
}
class OutputWrap {
  node: Node;
  tags: Node[];
}

@Injectable({
  providedIn: 'root'
})
export class NodeService {

  // ------------ Static ------------ //
  private static errorHandler = HttpService.errorHandler;
  private static unwrap = map<OutputWrap, Node>(r => { r.node.tags = r.tags; return r.node; });
  private static unwrapAll = map<OutputWrap[], Node[]>(rs => rs.map(r => { r.node.tags = r.tags; return r.node; }));

  private nodeCache = new Map<number, Node>();
  private obCache = new Map<number, Observable<Node>>();

  private static wrap(node: Node): InputWrap {
    const tags = node.tags as number[];
    node.tags = undefined;
    node.tags = undefined;
    return {node, tags};
  }
  private static wrapAll(nodes: Node[]): InputWrap[] {
    return nodes.map(node => NodeService.wrap(node));
  }
  public static canWrite(node: Node, user: User): boolean {
    return !(node.mainData.user !== user.id && node.mainData.permission !== 'public');
  }
  public static emptyNode(): Node {
    return {
      mainData: {
        id: null,
        user: null,
        title: null,
        type: null,
        linkDelete: false,
        linkVirtual: false,
        permission: 'private',
        nsfw: false,
        like: false,
        hide: false,
        sourceUrl: null,
        comment: null,
      }
    };
  }

  // ------------ Single Node Method ------------ //
  public add(node: Node): Observable<Node> {
    return this.httpService.post<OutputWrap>('node', NodeService.wrap(node)).pipe(
      NodeService.unwrap,
      tap(n => this.nodeCache.set(n.mainData.id, n)),
      NodeService.errorHandler,
    );
  }
  public get(id: number): Observable<Node> {
    if (this.obCache.has(id)) {
      return this.obCache.get(id);
    } else {
      const ob = this.httpService.get<OutputWrap>('node/' + id, null).pipe(
        NodeService.unwrap,
        tap(n => this.nodeCache.set(n.mainData.id, n)),
        shareReplay(1),
        NodeService.errorHandler,
      );
      this.obCache.set(id, ob);
      return ob;
    }
  }
  public update(node: Node): Observable<Node> {
    return this.httpService.put<OutputWrap>('node', NodeService.wrap(node)).pipe(
      NodeService.unwrap,
      tap<Node>(n => {
        this.nodeCache.set(n.mainData.id, n);
        this.obCache.delete(n.mainData.id);
      }),
      NodeService.errorHandler,
    );
  }
  public remove(id: number): Observable<void> {
    return this.httpService.delete<void>('node/' + id, null).pipe(
      tap(() => {
        this.nodeCache.delete(id);
        this.obCache.delete(id);
      }),
      NodeService.errorHandler,
    );
  }

  // ------------ Batch Node Method ------------ //
  public addAll(nodes: Node[]): Observable<Node[]> {
    return this.httpService.post<OutputWrap[]>('node/batch', NodeService.wrapAll(nodes)).pipe(
      NodeService.unwrapAll,
      tap<Node[]>(ns => ns.forEach(n => this.nodeCache.set(n.mainData.id, n))),
      NodeService.errorHandler,
    );
  }
  public getAll(filter: Filter = {}): Observable<Node[]> {
    return this.httpService.post<Node[]>('node/search', filter, true).pipe(NodeService.errorHandler);
  }
  public updateAll(nodes: Node[], isSimple = false): Observable<Node[]> {
    const wraps = NodeService.wrapAll(nodes);
    if (isSimple) {
      wraps.forEach(wrap => {
        const mainData = wrap.node.mainData;
        delete mainData.title;
        delete mainData.excerpt;
        delete mainData.comment;
      });
    }
    return this.httpService.put<OutputWrap[]>(`node/batch?simple=${isSimple}`, wraps).pipe(
      NodeService.unwrapAll,
      tap<Node[]>(ns => ns.forEach(n => {
        this.nodeCache.set(n.mainData.id, n);
        this.obCache.delete(n.mainData.id);
      })),
      NodeService.errorHandler,
    );
  }
  public removeAll(ids: number[]): Observable<void> {
    return this.httpService.delete<void>('node/batch', ids).pipe(
      tap(() => ids.forEach(id => {
        this.nodeCache.delete(id);
        this.obCache.delete(id);
      })),
      NodeService.errorHandler,
    );
  }

  // ------------ Util Method ------------ //
  public getAllByType(type: string, filter: Filter = {}): Observable<Node[]> {
    if (!filter.conditions) { filter.conditions = []; }
    filter.conditions.push({column: 'node_type', oper: '=', value: `'${type}'`});
    return this.httpService.post<Node[]>('node/search', filter, true).pipe(NodeService.errorHandler);
  }
  public getCache(id: number): Node {
    return this.nodeCache.get(id);
  }
  public clearCache() {
    this.nodeCache.clear();
    this.obCache.clear();
  }

  constructor(
    public view: ViewService,
    private httpService: HttpService,
  ) { }
}
