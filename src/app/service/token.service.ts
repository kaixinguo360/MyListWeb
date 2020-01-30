import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {tap} from 'rxjs/operators';
import {Observable} from 'rxjs';

import {HttpService} from './util/http.service';
import {PreferenceService} from './util/preference.service';
import {ViewService} from './util/view.service';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  public static password(pass: string) {
    // TODO
    return pass;
  }

  public generateToken(name: string, pass: string): Observable<string> {
    pass = TokenService.password(pass);
    return this.apiService.get<string>(
      this.viewService.admin ? `token/admin?pass=${pass}` : `token?name=${name}&pass=${pass}`,
      null, false)
      .pipe(
        tap(token => token ? this.preferenceService.set(this.viewService.admin ? 'admin_token' : 'token', token) : null)
      );
  }
  public invalidateToken(): Observable<void> {
    return this.apiService.delete<void>(this.viewService.admin ? 'token/admin' : 'token', null, true).pipe(
      tap(() => this.preferenceService.clean())
    );
  }

  public hasToken(): boolean {
    return Boolean(this.preferenceService.get(this.viewService.admin ? 'admin_token' : 'token'));
  }
  public getToken(): string {
    const token = this.preferenceService.get(this.viewService.admin ? 'admin_token' : 'token');
    if (token) {
      return token;
    } else {
      this.router.navigate([this.viewService.admin ? '/admin/login' : '/login']);
    }
  }

  constructor(
    private router: Router,
    private preferenceService: PreferenceService,
    private apiService: HttpService,
    private viewService: ViewService,
  ) {
    apiService.setAuthService(this);
  }
}
