import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';

import {EMPTY, Observable, OperatorFunction} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';

import {TokenService} from '../token.service';
import {AppConfig} from '../../../environments/app-config';
import {Router} from '@angular/router';
import {PreferenceService} from './preference.service';
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
  private static resultHandler: OperatorFunction<SimpleResponse<any>, any> = map<SimpleResponse<any>, any>(response  => response.result);
  public static errorHandler: OperatorFunction<any, any> = catchError(err => {
    const that = HttpService.thisService;
    if (err instanceof HttpErrorResponse) {
      if (err.status === 401) {
        that.view.alert('The token has expired, please log in again.');
        that.preferenceService.clean();
        that.router.navigate([that.view.admin ? '/admin/login' : '/login']);
      } else {
        const message = err.error ? err.error.message : null;
        that.view.alert(message ? message : 'An unknown error occurred.');
      }
    }
    return EMPTY;
  });

  private apiUrl = AppConfig.apiUrl;
  private tokenService: TokenService;

  public setTokenService(tokenService: TokenService) {
    this.tokenService = tokenService;
  }

  public get<T>(path: string, params?: { [param: string]: string | string[] }, needAuth = true): Observable<T> {
    this.view.setLoading(true);
    return this.http.get<SimpleResponse<T>>(this.apiUrl + path, {params,
      headers: needAuth ? { Authorization: this.tokenService.getToken() } : null
    }).pipe(
      tap(() => this.view.setLoading(false), () => this.view.setLoading(false)),
      HttpService.resultHandler
    );
  }
  public post<T>(path: string, body?: any, needAuth = true): Observable<T> {
    this.view.setLoading(true);
    return this.http.post<SimpleResponse<T>>(this.apiUrl + path,  body, {
      headers: needAuth ? { Authorization: this.tokenService.getToken() } : null
    }).pipe(
      tap(() => this.view.setLoading(false), () => this.view.setLoading(false)),
      HttpService.resultHandler
    );
  }
  public put<T>(path: string, body?: any, needAuth = true): Observable<T> {
    this.view.setLoading(true);
    return this.http.put<SimpleResponse<T>>(this.apiUrl + path,  body, {
      headers: needAuth ? { Authorization: this.tokenService.getToken() } : null
    }).pipe(
      tap(() => this.view.setLoading(false), () => this.view.setLoading(false)),
      HttpService.resultHandler
    );
  }
  public delete<T>(path: string, body?: any, needAuth = true): Observable<T> {
    this.view.setLoading(true);
    return this.http.request<SimpleResponse<T>>('delete', this.apiUrl + path, {body,
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
    return this.http.request<SimpleResponse<T>>(type, this.apiUrl + path, {body, params,
      headers: needAuth ? { Authorization: this.tokenService.getToken() } : null
    }).pipe(
      tap(() => this.view.setLoading(false), () => this.view.setLoading(false)),
      HttpService.resultHandler
    );
  }

  constructor(
    private http: HttpClient,
    private preferenceService: PreferenceService,
    private router: Router,
    public view: ViewService,
  ) {
    HttpService.thisService = this;
  }
}
