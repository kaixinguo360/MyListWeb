import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {tap} from 'rxjs/operators';
import {Observable} from 'rxjs';

import {HttpService} from './util/http.service';
import {PreferenceService} from './util/preference.service';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  public static password(pass: string) {
    // TODO
    return pass;
  }

  public generateToken(name: string, pass: string, admin = false): Observable<string> {
    pass = TokenService.password(pass);
    return this.apiService.get<string>(
      admin ? `token/admin?pass=${pass}` : `token?name=${name}&pass=${pass}`,
      null, false)
      .pipe(
        tap(token => token ? this.preferenceService.set(admin ? 'admin_token' : 'token', token) : null)
      );
  }
  public invalidateToken(admin = false): Observable<void> {
    return this.apiService.delete<void>(admin ? 'token/admin' : 'token', null, true, admin).pipe(
      tap(() => this.removeToken(admin))
    );
  }

  public hasToken(admin = false): boolean {
    return Boolean(this.preferenceService.get(admin ? 'admin_token' : 'token'));
  }
  public getToken(admin = false): string {
    const token = this.preferenceService.get(admin ? 'admin_token' : 'token');
    if (token) {
      return token;
    } else {
      this.router.navigate([admin ? '/admin/login' : '/login']);
    }
  }
  public removeToken(admin = false) {
    this.preferenceService.remove(admin ? 'admin_token' : 'token');
  }

  constructor(
    private router: Router,
    private preferenceService: PreferenceService,
    private apiService: HttpService,
  ) {
    apiService.setAuthService(this);
  }
}
