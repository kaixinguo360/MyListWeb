import {Injectable} from '@angular/core';
import {ViewService} from './view.service';
import {User} from '../user.service';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class Preference {

  private obs = new Map<string, Subject<string>>();

  public has(key: string): boolean {
    return !!localStorage.getItem(key);
  }
  public get(key: string, defaultValue?: string): string {
    const value = localStorage.getItem(key);
    if (value == null && defaultValue) {
      this.set(key, defaultValue);
      return defaultValue;
    } else {
      return value;
    }
  }
  public set(key: string, value: string): void {
    localStorage.setItem(key, value);
    if (this.obs.has(key)) { this.obs.get(key).next(value); }
  }
  public remove(key: string): void {
    localStorage.removeItem(key);
    if (this.obs.has(key)) { this.obs.get(key).next(null); }
  }

  public observable(key: string, defaultValue?: string): Observable<string> {
    if (this.obs.has(key)) {
      return this.obs.get(key);
    } else {
      const subject = new BehaviorSubject<string>(this.get(key, defaultValue));
      this.obs.set(key, subject);
      this.get(key, defaultValue);
      return subject;
    }
  }
  public switch(key: string, defaultValue?: boolean): Observable<boolean> {
    return this.observable(key, defaultValue ? 'true' : '')
      .pipe(map(value => Boolean(value)));
  }
  public toggle(key: string) {
    this.get(key) ? this.remove(key) : this.set(key, 'true');
  }

  public setUser(user: User) {
    this.view.user = user;
    this.set('user', JSON.stringify(user));
  }
  public clear() {
    if (this.view.admin) {
      localStorage.removeItem('admin_token');
    } else {
      const adminToken = localStorage.getItem('admin_token');
      localStorage.clear();
      localStorage.setItem('admin_token', adminToken);
    }
  }

  constructor(
    public view: ViewService,
  ) {
    const user = this.get('user');
    if (user) { this.view.user = JSON.parse(user); }
  }
}
