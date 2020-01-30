import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpService} from './util/http.service';
import {shareReplay, tap} from 'rxjs/operators';
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
  extraData: ExtraData;
  extraList: ListItem[];
}

@Injectable({
  providedIn: 'root'
})
export class NodeService {

  constructor(
    public view: ViewService,
    private httpService: HttpService,
  ) { }

  private errorHandler = HttpService.errorHandler;
  private nodeCache = new Map<number, Node>();
  private obCache = new Map<number, Observable<Node>>();
  public static canWrite(node: Node, user: User): boolean {
    return !(node.mainData.user !== user.id && node.mainData.permission !== 'public');
  }

  public add(node: Node): Observable<Node> {
    return this.httpService.post<Node>('node', node).pipe(
      tap<Node>(n => this.nodeCache.set(n.mainData.id, n)),
      this.errorHandler,
    );
  }
  public get(id: number): Observable<Node> {
    if (this.obCache.has(id)) {
      return this.obCache.get(id);
    } else {
      const ob = this.httpService.get<Node>('node/' + id, null).pipe(
        tap(n => this.nodeCache.set(n.mainData.id, n)),
        shareReplay(1),
        this.errorHandler,
      );
      this.obCache.set(id, ob);
      return ob;
    }
  }
  public update(node: Node): Observable<Node> {
    return this.httpService.put<Node>('node', node).pipe(
      tap<Node>(n => {
        this.nodeCache.set(n.mainData.id, n);
        this.obCache.delete(n.mainData.id);
      }),
      this.errorHandler,
    );
  }
  public remove(id: number): Observable<void> {
    return this.httpService.delete<void>('node/' + id, null).pipe(
      tap(() => {
        this.nodeCache.delete(id);
        this.obCache.delete(id);
      }),
      this.errorHandler,
    );
  }

  public getCache(id: number): Node {
    return this.nodeCache.get(id);
  }
}
