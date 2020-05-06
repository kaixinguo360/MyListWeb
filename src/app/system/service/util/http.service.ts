import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';

import {EMPTY, Observable, OperatorFunction, throwError} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';

import {TokenService} from '../token.service';
import {AppConfig} from '../../../../environments/app-config';
import {Preference} from './preference.service';
import {ViewService} from './view.service';

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
export class HttpService {

  private static thisService: HttpService;
  public static resultHandler: OperatorFunction<SimpleResponse<any>, any> = map<SimpleResponse<any>, any>(response  => response.result);
  public static errorHandler: OperatorFunction<any, any> = catchError(err => {
    const that = HttpService.thisService;
    if (err instanceof HttpErrorResponse) {
      if (err.status === 401) {
        that.view.alert('The token has expired, please log in again.');
        that.preference.clear();
        location.href = that.view.admin ? '/admin/login' : '/login';
        return EMPTY;
      } else {
        const message = err.error ? err.error.message : null;
        that.view.alert(message ? message : 'An unknown error occurred.');
      }
    }
    return throwError(err);
  });

  public tokenService: TokenService; // @Autowired

  public get<T>(path: string, params?: { [param: string]: string | string[] }, needAuth = true): Observable<T> {
    this.view.setLoading(true);
    return this.http.get<SimpleResponse<T>>(AppConfig.apiUrl + path, {params,
      headers: needAuth ? { Authorization: this.tokenService.getToken() } : null
    }).pipe(
      tap(() => this.view.setLoading(false), () => this.view.setLoading(false)),
      HttpService.resultHandler
    );
  }
  public post<T>(path: string, body?: any, needAuth = true): Observable<T> {
    this.view.setLoading(true);
    return this.http.post<SimpleResponse<T>>(AppConfig.apiUrl + path,  body, {
      headers: needAuth ? { Authorization: this.tokenService.getToken() } : null
    }).pipe(
      tap(() => this.view.setLoading(false), () => this.view.setLoading(false)),
      HttpService.resultHandler
    );
  }
  public put<T>(path: string, body?: any, needAuth = true): Observable<T> {
    this.view.setLoading(true);
    return this.http.put<SimpleResponse<T>>(AppConfig.apiUrl + path,  body, {
      headers: needAuth ? { Authorization: this.tokenService.getToken() } : null
    }).pipe(
      tap(() => this.view.setLoading(false), () => this.view.setLoading(false)),
      HttpService.resultHandler
    );
  }
  public delete<T>(path: string, body?: any, needAuth = true): Observable<T> {
    this.view.setLoading(true);
    return this.http.request<SimpleResponse<T>>('delete', AppConfig.apiUrl + path, {body,
      headers: needAuth ? { Authorization: this.tokenService.getToken() } : null
    }).pipe(
      tap(() => this.view.setLoading(false), () => this.view.setLoading(false)),
      HttpService.resultHandler
    );
  }

  public request<T>(type: string,
                    path: string,
                    body?: any,
                    params?: HttpParams | { [param: string]: string | string[]; },
                    needAuth: boolean = true): Observable<T> {
    this.view.setLoading(true);
    return this.http.request<SimpleResponse<T>>(type, AppConfig.apiUrl + path, {body, params,
      headers: needAuth ? { Authorization: this.tokenService.getToken() } : null
    }).pipe(
      tap(() => this.view.setLoading(false), () => this.view.setLoading(false)),
      HttpService.resultHandler
    );
  }

  constructor(
    public preference: Preference,
    private http: HttpClient,
    public view: ViewService,
  ) {
    HttpService.thisService = this;
  }
}
