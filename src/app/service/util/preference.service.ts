import {Injectable} from '@angular/core';
import {ViewService} from './view.service';
import {User} from '../user.service';

@Injectable({
  providedIn: 'root'
})
export class PreferenceService {

  public get(key: string, defaultValue?: string): string {
    const value = localStorage.getItem(key);
    if (value == null && defaultValue) {
      this.set(key, defaultValue);
      return defaultValue;
    } else {
      return value;
    }
  }
  public getNumber(key: string, defaultValue: number): number {
    return Number(this.get(key, defaultValue.toString()));
  }
  public set(key: string, value: string): void {
    localStorage.setItem(key, value);
  }
  public remove(key: string): void {
    localStorage.removeItem(key);
  }

  public setUser(user: User) {
    this.view.user = user;
    this.set('user', JSON.stringify(user));
  }
  public clean() {
    this.remove(this.view.admin ? 'admin_token' : 'token');
    if (!this.view.admin) {
      this.view.user = null;
      ['user', 'saved_filter', 'order'].forEach(key => this.remove(key));
    }
  }

  constructor(
    public view: ViewService,
  ) {
    const user = this.get('user');
    if (user) { this.view.user = JSON.parse(user); }
  }
}
