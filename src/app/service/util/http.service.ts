import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';

import {Observable, OperatorFunction, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

import {TokenService} from '../token.service';
import {AppConfig} from '../../../environments/app-config';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material';
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

  constructor(
    private http: HttpClient,
    private preferenceService: PreferenceService,
    private router: Router,
    private snackBar: MatSnackBar,
    private viewService: ViewService
  ) {
    HttpService.thisService = this;
  }

  public static thisService: HttpService;
  public static errorHandler: OperatorFunction<any, any> = catchError(err => {
    if (err instanceof HttpErrorResponse && err.status === 401) {
      const thisService = HttpService.thisService;
      thisService.snackBar.open('The token has expired, please log in again.', 'Close', {duration: 2000});
      thisService.preferenceService.remove(thisService.viewService.admin ? 'admin_token' : 'token');
      thisService.router.navigate([thisService.viewService.admin ? '/admin/login' : '/login']);
    }
    return throwError(err);
  });
  public static resultHandler: OperatorFunction<SimpleResponse<any>, any> = map<SimpleResponse<any>, any>(response  => response.result);

  private apiUrl = AppConfig.apiUrl;
  private authService: TokenService;

  public setAuthService(authService: TokenService) {
    this.authService = authService;
  }

  public get<T>(path: string, params?: { [param: string]: string | string[] }, needAuth = true): Observable<T> {
    return this.http.get<SimpleResponse<T>>(this.apiUrl + path, {params,
      headers: needAuth ? { Authorization: this.authService.getToken() } : null
    }).pipe(HttpService.resultHandler);
  }
  public post<T>(path: string, body?: any, needAuth = true): Observable<T> {
    return this.http.post<SimpleResponse<T>>(this.apiUrl + path,  body, {
      headers: needAuth ? { Authorization: this.authService.getToken() } : null
    }).pipe(HttpService.resultHandler);
  }
  public put<T>(path: string, body?: any, needAuth = true): Observable<T> {
    return this.http.put<SimpleResponse<T>>(this.apiUrl + path,  body, {
      headers: needAuth ? { Authorization: this.authService.getToken() } : null
    }).pipe(HttpService.resultHandler);
  }
  public delete<T>(path: string, body?: any, needAuth = true): Observable<T> {
    return this.http.request<SimpleResponse<T>>('delete', this.apiUrl + path, {body,
      headers: needAuth ? { Authorization: this.authService.getToken() } : null
    }).pipe(HttpService.resultHandler);
  }

  public request<T>(type: string,
                    path: string,
                    body?: any,
                    params?: HttpParams | { [param: string]: string | string[]; },
                    needAuth: boolean = true): Observable<T> {
    return this.http.request<SimpleResponse<T>>(type, this.apiUrl + path, {body, params,
      headers: needAuth ? { Authorization: this.authService.getToken() } : null
    }).pipe(HttpService.resultHandler);
  }
}
