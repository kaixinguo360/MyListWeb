import {Injectable} from '@angular/core';
import {ViewService} from './view.service';
import {User} from '../user.service';
import {Observable, Subject} from 'rxjs';
import {map, shareReplay} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class Preference {

  private obs = new Map<string, {subject: Subject<string>, observable: Observable<string>}>();

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
  public getObservable(key: string, defaultValue?: string): Observable<string> {
    if (this.obs.has(key)) {
      return this.obs.get(key).observable;
    } else {
      const subject = new Subject<string>();
      const observable = subject.pipe(shareReplay(1));
      this.obs.set(key, {subject, observable});

      const value = this.get(key, defaultValue);
      subject.next(value);
      return observable;
    }
  }
  public getSwitch(key: string, defaultValue?: boolean): Observable<boolean> {
    return this.getObservable(key, defaultValue ? 'true' : '')
      .pipe(map(value => Boolean(value)));
  }
  public set(key: string, value: string): void {
    localStorage.setItem(key, value);
    if (this.obs.has(key)) { this.obs.get(key).subject.next(value); }
  }
  public remove(key: string): void {
    localStorage.removeItem(key);
    if (this.obs.has(key)) { this.obs.get(key).subject.next(null); }
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
