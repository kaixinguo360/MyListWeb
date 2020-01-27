import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';

import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

import {TokenService} from '../token.service';
import {AppConfig} from '../../../environments/app-config';

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
  ) { }

  private apiUrl = AppConfig.apiUrl;
  private authService: TokenService;

  private static handleResult<T>(ob: Observable<SimpleResponse<T>>) {
    return ob.pipe(
      map(response => response.result)
    );
  }

  public setAuthService(authService: TokenService) {
    this.authService = authService;
  }

  public get<T>(path: string, params?: { [param: string]: string | string[] }, needAuth = true, admin = false): Observable<T> {
    return HttpService.handleResult(
      this.http.get<SimpleResponse<T>>(this.apiUrl + path, {params,
        headers: needAuth ? { Authorization: this.authService.getToken(admin) } : null
      })
    );
  }
  public post<T>(path: string, body?: any, needAuth = true, admin = false): Observable<T> {
    return HttpService.handleResult(
      this.http.post<SimpleResponse<T>>(this.apiUrl + path,  body, {
        headers: needAuth ? { Authorization: this.authService.getToken(admin) } : null
      })
    );
  }
  public put<T>(path: string, body?: any, needAuth = true, admin = false): Observable<T> {
    return HttpService.handleResult(
      this.http.put<SimpleResponse<T>>(this.apiUrl + path,  body, {
        headers: needAuth ? { Authorization: this.authService.getToken(admin) } : null
      })
    );
  }
  public delete<T>(path: string, body?: any, needAuth = true, admin = false): Observable<T> {
    return HttpService.handleResult(
      this.http.request<SimpleResponse<T>>('delete', this.apiUrl + path, {body,
        headers: needAuth ? { Authorization: this.authService.getToken(admin) } : null
      })
    );
  }

  public request<T>(type: string,
                    path: string,
                    body?: any,
                    params?: HttpParams | { [param: string]: string | string[]; },
                    needAuth: boolean = true, admin = false): Observable<T> {
    return HttpService.handleResult(
      this.http.request<SimpleResponse<T>>(type, this.apiUrl + path, {body, params,
        headers: needAuth ? { Authorization: this.authService.getToken(admin) } : null
      })
    );
  }
}
