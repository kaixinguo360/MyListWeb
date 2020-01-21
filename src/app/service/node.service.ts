import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {Observable} from 'rxjs';
import {ApiService} from './api.service';

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

  public addNode(node: Node): Observable<Node> {
    return this.apiService.post<Node>('node', node, true);
  }
  public getNode(id: number): Observable<Node> {
    return this.apiService.get<Node>('node/' + id, null, true);
  }
  public getNodes(): Observable<Node[]> {
    return this.apiService.get<Node[]>('search', null, true);
  }
  public updateNodes(node: Node): Observable<Node> {
    return this.apiService.put<Node>('node', node, true);
  }
  public removeNode(id: string): Observable<void> {
    return this.apiService.delete<void>('node/' + id, null, true);
  }

  // TODO
  private handleError(err) {
    console.log(err);
    this.matSnackBar.open('Network connection error', 'Close', {
      duration: 2000,
    });
  }

  constructor(
    private matSnackBar: MatSnackBar,
    private apiService: ApiService,
  ) { }
}
