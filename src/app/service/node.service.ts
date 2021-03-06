import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {HttpService} from './http.service';
import {map, shareReplay, tap} from 'rxjs/operators';
import {ViewService} from './view.service';
import {User} from './user.service';

// ------------ Node ------------ //
export class MainData {
  id?: number;
  user?: number;
  type?: string;
  ctime?: number;
  mtime?: number;
  title?: string;
  excerpt?: string;
  part?: boolean;
  collection?: boolean;
  permission?: string;
  nsfw?: boolean;
  like?: boolean;
  hide?: boolean;
  source?: string;
  description?: string;
  comment?: string;
}
export class ExtraData {
  nodeType: string;
}
export class ListItem<T extends ExtraData = ExtraData> {
  node?: Node<T>;
  status?: string;
}
export class Node<T extends ExtraData = ExtraData> {
  mainData: MainData;
  extraData?: T;
  extraList?: ListItem[];
  tags?: Node[] | number[];
}

// ------------ Filter ------------ //
export class Condition {
  column: string;
  oper: string;
  value: any;
}
export class Sort {
  property: string;
  direction: string;
}
export class Tag {
  strict?: boolean;
  value?: string;
  id?: number;
  type?: string;
}
export class Filter {
  cascade?: boolean;
  part?: boolean;
  collection?: boolean;
  types?: string[];

  conditions?: Condition[];
  sorts?: Sort[];
  permission?: string;

  nsfw?: boolean;
  like?: boolean;
  hide?: boolean;

  andTags?: Tag[];
  orTags?: Tag[];
  notTags?: Tag[];

  andKeywords?: string[];
  orKeywords?: string[];
  notKeywords?: string[];
}

// ------------ Event & Wrap ------------ //

export class NodeChangeEvent {
  added?: Node[];
  updated?: number[];
  deleted?: number[];
}
class InputWrap {
  id?: number;
  node?: Node;
  tags?: number[];
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
  private cache = new Map<string, Observable<any>>();
  private static wrap(node: Node): InputWrap {
    const tags = node.tags as number[];
    node.tags = undefined;
    return {node, tags};
  }
  private static wrapAll(nodes: Node[]): InputWrap[] {
    return nodes.map(node => NodeService.wrap(node));
  }
  public static canWrite(node: Node, user: User): boolean {
    return !((node.mainData.user !== user.id || node.mainData.user == null) && node.mainData.permission !== 'public');
  }
  public static emptyNode(): Node {
    return {
      mainData: {
        id: null,
        user: null,
        title: null,
        type: null,
        part: false,
        collection: false,
        permission: 'private',
        nsfw: false,
        like: false,
        hide: false,
        source: null,
        description: null,
      }
    };
  }

  // ------------ Single Node Method ------------ //
  public add(node: Node): Observable<Node> {
    return this.httpService.post<OutputWrap>('node', NodeService.wrap(node)).pipe(
      NodeService.unwrap,
      tap(n => this.handleChange({added: [n]})),
      NodeService.errorHandler,
    );
  }
  public get(id: number): Observable<Node> {
    const key = String(id);
    if (this.cache.has(key)) {
      return this.cache.get(key);
    } else {
      const ob = this.httpService.get<OutputWrap>('node/' + id, null).pipe(
        NodeService.unwrap,
        NodeService.errorHandler,
        shareReplay(1),
      );
      this.cache.set(key, ob);
      return ob;
    }
  }
  public update(node: Node): Observable<Node> {
    return this.httpService.put<OutputWrap>('node', NodeService.wrap(node)).pipe(
      NodeService.unwrap,
      tap(() => this.handleChange({updated: [node.mainData.id]})),
      NodeService.errorHandler,
    );
  }
  public delete(id: number): Observable<void> {
    return this.httpService.delete<void>('node/' + id, null).pipe(
      tap(() => this.handleChange({deleted: [id]})),
      NodeService.errorHandler,
    );
  }

  // ------------ Batch Node Method ------------ //
  public addAll(nodes: Node[]): Observable<Node[]> {
    return this.httpService.post<OutputWrap[]>('node/batch', NodeService.wrapAll(nodes)).pipe(
      NodeService.unwrapAll,
      tap<Node[]>(ns => this.handleChange({added: ns})),
      NodeService.errorHandler,
    );
  }
  public getAll(filter: Filter = {}): Observable<Node[]> {
    const key = JSON.stringify(filter);
    if (this.cache.has(key)) {
      return this.cache.get(key);
    } else {
      const ob = this.httpService.post<Node[]>('node/search', filter, true).pipe(
        NodeService.errorHandler,
        shareReplay(1),
      );
      this.cache.set(key, ob);
      return ob;
    }
  }
  public getAllByType(types: string | string[], filter?: Filter): Observable<Node[]> {
    if (!filter) { filter = {}; }
    if (!filter.conditions) { filter.conditions = []; }
    if (!(types instanceof Array)) { types = [types]; }
    let typeStr = '';
    for (let i = 0; i < types.length; i++) {
      typeStr += `'${types[i]}'`;
      if (i !== types.length - 1) {
        typeStr += ',';
      }
    }
    filter.conditions.push({column: 'content.node_type', oper: 'in', value: `(${typeStr})`});
    return this.getAll(filter);
  }
  public updateAll(nodes: Node[], isSimple = false, tagMode = 'set'): Observable<Node[]> {
    const wraps = NodeService.wrapAll(nodes);
    if (isSimple) {
      wraps.forEach(wrap => {
        const mainData = wrap.node.mainData;
        delete mainData.title;
        delete mainData.excerpt;
        delete mainData.description;
      });
    }
    return this.httpService.put<OutputWrap[]>(`node/batch?simple=${isSimple}&tag=${tagMode}`, wraps).pipe(
      NodeService.unwrapAll,
      tap(() => this.handleChange({updated: nodes.map(n => n.mainData.id)})),
      NodeService.errorHandler,
    );
  }
  public updateTags(nodeIds: number[], tagIds: number[], action = 'set'): Observable<Node[]> {
    if (!tagIds.length) { return throwError('tagIds.length is 0!'); }
    return this.httpService.put<OutputWrap[]>(`node/tag?id=${tagIds.join('&id=')}&action=${action}`, nodeIds).pipe(
      tap(() => this.handleChange({
        updated: nodeIds.concat(tagIds.filter(t => nodeIds.indexOf(t) < 0))
      })),
      NodeService.errorHandler,
    );
  }
  public deleteAll(ids: number[]): Observable<void> {
    return this.httpService.delete<void>('node/batch', ids).pipe(
      tap(() => this.handleChange({deleted: ids})),
      NodeService.errorHandler,
    );
  }

  // ------------ Util Method ------------ //
  private handleChange(event: NodeChangeEvent) {
    this.cache.clear();
    this.view.notify('node@onchange', event);
  }

  constructor(
    public view: ViewService,
    private httpService: HttpService,
  ) { }
}
