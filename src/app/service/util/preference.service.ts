import {Injectable} from '@angular/core';

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

  constructor() { }
}
