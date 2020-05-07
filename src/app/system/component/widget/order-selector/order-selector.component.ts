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
  @Input() orderConfig: OrderConfig[];

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
  }

  constructor(
    public orderService: OrderService
  ) {}
}
