import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpService} from './util/http.service';
import {Node} from './node.service';

export class Condition {
  column?: string;
  oper?: string;
  value?: any;
}
export class Sort {
  property?: string;
  direction?: string;
}
export class Tag {
  strict?: boolean;
  value?: string;
  id?: number;
  type?: string;
}
export class Query {
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
export class SearchService {

  public search(query: Query): Observable<Node[]> {
    return this.httpService.post<Node[]>('search', query, true);
  }
  public getAll(): Observable<Node[]> {
    return this.httpService.get<Node[]>('search', null, true);
  }

  constructor(
    private httpService: HttpService,
  ) { }
}
