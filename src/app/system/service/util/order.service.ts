import {Injectable} from '@angular/core';
import {AppConfig} from '../../../../environments/app-config';
import {Order} from './order';
import {Preference} from './preference.service';
import {ViewService} from './view.service';

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
