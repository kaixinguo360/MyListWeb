import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {Router} from '@angular/router';

import {Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

import {AuthService} from './auth.service';
import {AppConfig} from '../../environments/app-config';

export interface SimpleResponse<T> {
  result?: T;
  success?: boolean;
  error?: string;
  message?: string;
  status?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = AppConfig.apiUrl;
  private authService: AuthService;

  public setAuthService(authService: AuthService) {
    this.authService = authService;
  }

  public get<T>(path: string, params?: { [param: string]: string | string[] }, needAuth: boolean = true): Observable<T> {
    return this.handleResult(needAuth,
      this.http.get<SimpleResponse<T>>(this.apiUrl + path, {params,
        headers: needAuth ? { Authorization: this.authService.getToken() } : null
      })
    );
  }
  public post<T>(path: string, body?: any, needAuth: boolean = true): Observable<T> {
    return this.handleResult(needAuth,
      this.http.post<SimpleResponse<T>>(this.apiUrl + path,  body, {
        headers: needAuth ? { Authorization: this.authService.getToken() } : null
      })
    );
  }
  public put<T>(path: string, body?: any, needAuth: boolean = true): Observable<T> {
    return this.handleResult(needAuth,
      this.http.put<SimpleResponse<T>>(this.apiUrl + path,  body, {
        headers: needAuth ? { Authorization: this.authService.getToken() } : null
      })
    );
  }
  public delete<T>(path: string, body?: any, needAuth: boolean = true): Observable<T> {
    return this.handleResult(needAuth,
      this.http.request<SimpleResponse<T>>('delete', this.apiUrl + path, {body,
        headers: needAuth ? { Authorization: this.authService.getToken() } : null
      })
    );
  }

  public request<T>(type: string,
                    path: string,
                    body?: any,
                    params?: HttpParams | { [param: string]: string | string[]; },
                    needAuth: boolean = true): Observable<T> {
    return this.handleResult(needAuth,
      this.http.request<SimpleResponse<T>>(type, this.apiUrl + path, {body, params,
        headers: needAuth ? { Authorization: this.authService.getToken() } : null
      })
    );
  }

  private handleResult<T>(needAuth: boolean, ob: Observable<SimpleResponse<T>>) {
    return ob.pipe(
      map(response => response.result),
      catchError(err => {
        this.handleError(err, needAuth);
        return throwError(err);
      })
    );
  }
  private handleError(err, needAuth: boolean) {
    if (err instanceof HttpErrorResponse && err.status === 401) {
      this.authService.clearToken();
      if (needAuth) {
        this.router.navigate([ '' ]);
      }
    }
  }

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }
}
