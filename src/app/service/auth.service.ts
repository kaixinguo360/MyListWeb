import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {tap} from 'rxjs/operators';
import {Observable} from 'rxjs';

import {ApiService} from './api.service';
import {PreferenceService} from './preference.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private router: Router,
    private preferenceService: PreferenceService,
    private apiService: ApiService,
  ) {
    apiService.setAuthService(this);
  }

  private static password(pass: string) {
    // TODO
    return pass;
  }

  public login(name: string, pass: string, safe = true): Observable<string> {
    pass = safe ? AuthService.password(pass) : pass;
    return this.apiService.get<string>(`token?name=${name}&pass=${pass}&safe=${safe}`, null, false).pipe(
      tap(token => token ? this.preferenceService.set('token', token) : null)
    );
  }

  public logout(): Observable<void> {
    return this.apiService.delete<void>('token').pipe(
      tap(() => this.clearToken())
    );
  }

  public isLogin(): boolean {
    return Boolean(this.getToken());
  }

  public getToken(): string {
    const token = this.preferenceService.get('token');
    if (token) {
      return token;
    } else {
      this.router.navigate(['/login']);
    }
  }

  public clearToken() {
    this.preferenceService.remove('token');
  }
}
