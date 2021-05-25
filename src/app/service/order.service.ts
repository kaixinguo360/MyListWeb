import {Injectable} from '@angular/core';
import {AppConfig} from '../../environments/app-config';
import {Preference} from './preference.service';
import {ViewService} from './view.service';
import {Sort} from './node.service';

export enum Order {
  MTIME_DESC = 'MTIME_DESC',
  MTIME_ASC = 'MTIME_ASC',
  CTIME_DESC = 'CTIME_DESC',
  CTIME_ASC = 'CTIME_ASC',
  NAME_DESC = 'NAME_DESC',
  NAME_ASC = 'NAME_ASC',
  RANDOM = 'RANDOM'
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  public order: Order;

  public setOrder(order: Order): void {
    this.order = order ? order : AppConfig.defaultOrder;
    this.preference.set('order', this.order);
    this.view.notify('order@onchange');
  }
  public getSort(): Sort {
    switch (this.order) {
      case Order.MTIME_DESC: return {property: 'node_mtime', direction: 'desc'};
      case Order.MTIME_ASC: return {property: 'node_mtime', direction: 'asc'};
      case Order.CTIME_DESC: return {property: 'node_ctime', direction: 'desc'};
      case Order.CTIME_ASC: return {property: 'node_ctime', direction: 'asc'};
      case Order.NAME_DESC: return {property: 'node_title', direction: 'desc'};
      case Order.NAME_ASC: return {property: 'node_title', direction: 'asc'};
      case Order.RANDOM: return null;
      default:
        this.preference.set('order', AppConfig.defaultOrder);
        return {property: 'node_mtime', direction: 'desc'};
    }
  }

  constructor(
    public view: ViewService,
    public preference: Preference,
  ) {
    switch (this.preference.get('order', AppConfig.defaultOrder)) {
      case Order.MTIME_DESC: this.order = Order.MTIME_DESC; break;
      case Order.MTIME_ASC: this.order = Order.MTIME_ASC; break;
      case Order.CTIME_DESC: this.order = Order.CTIME_DESC; break;
      case Order.CTIME_ASC: this.order = Order.CTIME_ASC; break;
      case Order.NAME_DESC: this.order = Order.NAME_DESC; break;
      case Order.NAME_ASC: this.order = Order.NAME_ASC; break;
      case Order.RANDOM: this.order = Order.RANDOM; break;
      default:
        this.preference.set('order', AppConfig.defaultOrder);
        this.order = AppConfig.defaultOrder; break;
    }
  }
}
