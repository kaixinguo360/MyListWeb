import {Injectable} from '@angular/core';
import {ViewService} from './view.service';

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

  public clean() {
    this.remove(this.viewService.admin ? 'admin_token' : 'token');
    if (!this.viewService.admin) {
      ['saved_filter', 'order'].forEach(key => this.remove(key));
    }
  }

  constructor(
    private viewService: ViewService
  ) { }
}
