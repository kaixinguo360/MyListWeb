import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {catchError, tap} from 'rxjs/operators';
import {Observable, of, throwError} from 'rxjs';

import {HttpService} from './util/http.service';
import {Preference} from './util/preference.service';
import {ViewService} from './util/view.service';
import {HttpErrorResponse} from '@angular/common/http';
import {User} from './user.service';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private errorHandler = catchError(err => {
    if (err instanceof HttpErrorResponse && err.status === 403) {
      this.view.alert('Wrong user name or password!');
    } else {
      this.view.alert('Unknown error!');
    }
    return throwError(err);
  });
  public static password(pass: string) {
    // TODO
    return pass;
  }

  public generateToken(name: string, pass: string): Observable<any> {
    pass = TokenService.password(pass);
    return this.apiService.get<{token: string, user: User}>(`token?name=${name}&pass=${pass}`, null, false)
      .pipe(
        tap<{token: string, user: User}>(result => {
          this.preference.set('token', result.token);
          this.preference.setUser(result.user);
        }),
        this.errorHandler
      );
  }
  public generateAdminToken(pass: string): Observable<any> {
    pass = TokenService.password(pass);
    return this.apiService.get<string>(`token/admin?pass=${pass}`, null, false)
      .pipe(
        tap<string>(token => this.preference.set('admin_token', token)),
        this.errorHandler
      );
  }
  public invalidateToken(): Observable<void> {
    return this.apiService.delete<void>(this.view.admin ? 'token/admin' : 'token', null, true).pipe(
      catchError(err => of(err)),
      tap(() => this.preference.clear())
    );
  }

  public hasToken(): boolean {
    return Boolean(this.preference.get(this.view.admin ? 'admin_token' : 'token'));
  }
  public getToken(): string {
    const token = this.preference.get(this.view.admin ? 'admin_token' : 'token');
    if (token) {
      return token;
    } else {
      this.router.navigate([this.view.admin ? '/admin/login' : '/login']);
    }
  }

  constructor(
    public view: ViewService,
    private router: Router,
    private preference: Preference,
    private apiService: HttpService,
  ) { }
}
