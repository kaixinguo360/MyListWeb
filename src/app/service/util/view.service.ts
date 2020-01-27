import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ViewService {
  public title = 'Title';
  public hasBackButton: boolean;
  public loading = false;

  public init(title: string) {
    this.title = title;
    this.hasBackButton = false;
    this.loading = false;
  }
}
