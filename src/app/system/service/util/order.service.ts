import {Injectable} from '@angular/core';
import {Preference} from './preference.service';
import {ViewService} from './view.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  defaultOrder = 'ctime';
  defaultDirection = 'asc';

  public setOrder(id: string, order: string, direction: string): void {
    this.preference.set(`orderBy@${id}`, order);
    this.preference.set(`orderDirection@${id}`, direction);
    this.view.notify('order@onchange', {order, direction});
  }
  public getOrder(id: string): string {
    return this.preference.get(`orderBy@${id}`, this.defaultOrder);
  }
  public getDirection(id: string): string {
    return this.preference.get(`orderDirection@${id}`, this.defaultDirection);
  }

  constructor(
    public view: ViewService,
    public preference: Preference,
  ) {}
}
