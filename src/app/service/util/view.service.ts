import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ViewService {
  public title = 'Title';
  public icons: string[] = [];
  public admin = false;
  public loading = false;
  public changed = false;

  public init(title: string, icons = ['order', 'home'], admin = false) {
    this.changed = true;
    this.title = title;
    this.icons = icons;
    this.admin = admin;
    this.loading = false;
  }

  public hasIcon(icon: string): boolean {
    this.changed = true;
    return this.icons.indexOf(icon) !== -1;
  }

  public setLoading(loading: boolean) {
    this.changed = true;
    this.loading = loading;
  }
}
