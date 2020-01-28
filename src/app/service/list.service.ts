import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpService} from './util/http.service';
import {Node} from './node.service';

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
  conditions?: Condition[];
  sorts?: Sort[];
  permission?: string;

  nsfw?: boolean;
  like?: boolean;
  hide?: boolean;

  andTags?: Tag[];
  orTags?: Tag[];
  notTags?: Tag[];
}

@Injectable({
  providedIn: 'root'
})
export class ListService {

  constructor(
    private httpService: HttpService,
  ) { }

  private static path = 'search';
  private errorHandler = HttpService.errorHandler;

  public getAll(filter: Filter = {}): Observable<Node[]> {
    return this.httpService.post<Node[]>(ListService.path, filter, true).pipe(this.errorHandler);
  }
  public getAllByType(type: string, filter: Filter = {}): Observable<Node[]> {
    filter.conditions.push({column: 'node_type', oper: '=', value: type});
    return this.httpService.post<Node[]>(ListService.path, filter, true).pipe(this.errorHandler);
  }
  public getAllByListId(listId: number, filter: Filter = {}): Observable<Node[]> {
    filter.andTags.push({id: listId});
    return this.httpService.post<Node[]>(ListService.path, filter, true).pipe(this.errorHandler);
  }
}
