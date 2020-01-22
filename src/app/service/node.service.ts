import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {Observable, of} from 'rxjs';
import {ApiService} from './api.service';
import {catchError, shareReplay, tap} from 'rxjs/operators';

export class MainData {
  id?: number;
  user?: number;
  type?: string;
  ctime?: number;
  mtime?: number;
  title?: string;
  excerpt?: string;
  linkForward?: number;
  linkBack?: number;
  linkDelete?: boolean;
  linkVirtual?: boolean;
  permission?: string;
  nsfw?: boolean;
  like?: boolean;
  hide?: boolean;
  sourceUrl?: string;
  comment?: string;
}
export class ListItem {
  node: Node;
  status: string;
}
export class Node {
  mainData: MainData;
  extraData: object;
  extraList: ListItem[];
}

@Injectable({
  providedIn: 'root'
})
export class NodeService {

  private nodeCache = new Map<number, Node>();
  private obCache = new Map<number, Observable<Node>>();

  public add(node: Node): Observable<Node> {
    return this.apiService.post<Node>('node', node, true).pipe(
      tap(n => this.nodeCache.set(n.mainData.id, n)),
      catchError(err => this.handleError(err))
    );
  }
  public get(id: number): Observable<Node> {
    if (this.obCache.has(id)) {
      return this.obCache.get(id);
    } else {
      const ob = this.apiService.get<Node>('node/' + id, null, true).pipe(
        tap(n => this.nodeCache.set(n.mainData.id, n)),
        shareReplay(1),
        catchError(err => this.handleError(err))
      );
      this.obCache.set(id, ob);
      return ob;
    }
  }
  public update(node: Node): Observable<Node> {
    return this.apiService.put<Node>('node', node, true).pipe(
      tap(n => this.nodeCache.set(n.mainData.id, n)),
      catchError(err => this.handleError(err))
    );
  }
  public remove(id: number): Observable<void> {
    return this.apiService.delete<void>('node/' + id, null, true).pipe(
      tap(() => this.nodeCache.delete(id)),
      catchError(err => this.handleError(err))
    );
  }

  public getCache(id: number): Node {
    return this.nodeCache.get(id);
  }

  private handleError(err): Observable<any> {
    this.matSnackBar.open('Network connection error', 'Close', {
      duration: 2000,
    });
    return of(err);
  }

  constructor(
    private matSnackBar: MatSnackBar,
    private apiService: ApiService,
  ) { }
}
