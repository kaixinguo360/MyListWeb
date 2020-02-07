import {Component, OnInit} from '@angular/core';
import {Order} from '../../../service/util/order';
import {OrderService} from '../../../service/util/order.service';
import {Sort} from '../../../service/util/filter';
import {Subject} from 'rxjs';

class OrderMenuItem {
  title: string;
  tip: string;
  order: Order;
  icon: string;
}

@Component({
  selector: 'app-order-filter',
  templateUrl: './order-filter.component.html',
  styleUrls: ['./order-filter.component.css']
})
export class OrderFilterComponent implements OnInit {
  public orderMenuItems: OrderMenuItem[];
  public currentOrder: Order;
  private onChangeSubject = new Subject<void>();

  changeOrder(order: Order) {
    this.currentOrder = order;
    this.orderService.setOrder(order);
    this.onChangeSubject.next();
  }
  public getSort(): Sort {
    return this.orderService.getSort();
  }
  public onChange(next?: (value: void) => void, error?: (error: any) => void, complete?: () => void) {
    this.onChangeSubject.subscribe(next, error, complete);
  }

  constructor(
    private orderService: OrderService,
  ) { }

  ngOnInit() {
    this.currentOrder = this.orderService.getOrder();
    this.orderMenuItems  = [
      { title: '↑ 修改时间', tip: '最旧在前', icon: 'access_time', order: Order.MTIME_ASC },
      { title: '↓ 修改时间', tip: '最新在前', icon: 'access_time', order: Order.MTIME_DESC },
      { title: '↑ 创建时间', tip: '最旧在前', icon: 'create_new_folder', order: Order.CTIME_ASC },
      { title: '↓ 创建时间', tip: '最新在前', icon: 'create_new_folder', order: Order.CTIME_DESC },
      { title: '↑ 名称', tip: 'A在前', icon: 'sort_by_alpha', order: Order.NAME_ASC },
      { title: '↓ 名称', tip: 'Z在前', icon: 'sort_by_alpha', order: Order.NAME_DESC },
      { title: '随机', tip: '随机排列', icon: 'blur_on', order: Order.RANDOM }
    ];
  }

}
