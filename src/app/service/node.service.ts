import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpService} from './util/http.service';
import {map, shareReplay, tap} from 'rxjs/operators';
import {ViewService} from './util/view.service';
import {User} from './user.service';

export class MainData {
  id?: number;
  user?: number;
  type?: string;
  ctime?: number;
  mtime?: number;
  title?: string;
  excerpt?: string;
  linkDelete?: boolean;
  linkVirtual?: boolean;
  permission?: string;
  nsfw?: boolean;
  like?: boolean;
  hide?: boolean;
  sourceUrl?: string;
  comment?: string;
}
export class ExtraData {
}
export class ListItem {
  node: Node;
  status: string;
}
export class Node {
  mainData: MainData;
  extraData?: ExtraData;
  extraList?: ListItem[];
  tags?: Node[] | number[];
}

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

  private static errorHandler = HttpService.errorHandler;
  private static unwrap = map<OutputWrap, Node>(result => { result.node.tags = result.tags; return result.node; });

  private nodeCache = new Map<number, Node>();
  private obCache = new Map<number, Observable<Node>>();

  private static wrap(node: Node): InputWrap {
    const tags = node.tags as number[];
    node.tags = undefined;
    node.tags = undefined;
    return {node, tags};
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

  public getCache(id: number): Node {
    return this.nodeCache.get(id);
  }

  constructor(
    public view: ViewService,
    private httpService: HttpService,
  ) { }
}
