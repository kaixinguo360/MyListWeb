import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {Observable} from 'rxjs';
import {Node} from './node';
import {SearchService} from './search.service';

@Injectable({
  providedIn: 'root'
})
export class NodeService {

  public getAll(): Observable<Node[]> {
    return this.searchService.search({
      conditions: [{ column: 'node_type', oper: '=', value: 'list' }]
    });
  }
  public getList(id: number): Observable<Node[]> {
    return this.searchService.search({
      orTags: [{ id, type: 'list' }]
    });
  }

  constructor(
    private matSnackBar: MatSnackBar,
    private searchService: SearchService,
  ) { }
}
