import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ViewService {
  public title = 'Title';
  public hasBackButton: boolean;
}
