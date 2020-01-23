import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {Observable, of} from 'rxjs';
import {ApiService} from './api.service';
import {catchError} from 'rxjs/operators';
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
    return this.apiService.post<Node[]>('search', query, true).pipe(
      catchError(err => this.handleError(err))
    );
  }
  public getAll(): Observable<Node[]> {
    return this.apiService.get<Node[]>('search', null, true).pipe(
      catchError(err => this.handleError(err))
    );
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
