import {Component, Input, OnInit} from '@angular/core';
import {OrderService} from '../../../service/util/order.service';

class OrderConfig {
  name: string;
  order: string;
  direction: string;
  icon: string;
  tip?: string;
}

@Component({
  selector: 'app-order-selector',
  templateUrl: './order-selector.component.html',
  styleUrls: ['./order-selector.component.css']
})
export class OrderSelectorComponent implements OnInit {

  @Input() id: string;
  @Input() columnName: string;

  orderConfig: OrderConfig[];
  currentOrder: string;
  currentDirection: string;

  setOrder(config: OrderConfig) {
    this.currentOrder = config.order;
    this.currentDirection = config.direction;
    this.orderService.setOrder(this.id, config.order, config.direction);
  }

  ngOnInit(): void {
    this.currentOrder = this.orderService.getOrder(this.id);
    this.currentDirection = this.orderService.getDirection(this.id);
    this.orderConfig = [
      { name: '↑ 修改时间', tip: '最旧在前', icon: 'access_time', order: 'mtime', direction: 'asc' },
      { name: '↓ 修改时间', tip: '最新在前', icon: 'access_time', order: 'mtime', direction: 'desc' },
      { name: '↑ 创建时间', tip: '最旧在前', icon: 'create_new_folder', order: 'ctime', direction: 'asc' },
      { name: '↓ 创建时间', tip: '最新在前', icon: 'create_new_folder', order: 'ctime', direction: 'desc' },
      { name: '↑ 名称', tip: 'A在前', icon: 'sort_by_alpha', order: this.columnName, direction: 'asc' },
      { name: '↓ 名称', tip: 'Z在前', icon: 'sort_by_alpha', order: this.columnName, direction: 'desc' },
    ];
  }

  constructor(
    public orderService: OrderService
  ) {}
}
