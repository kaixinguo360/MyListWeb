import {Component, Input, OnInit} from '@angular/core';

import {Node} from '../../../service/node.service';
import {Order} from '../../../order';
import {OrderService} from '../../../service/order.service';
import {TypeInfo, TypeService} from '../../../service/type.service';

@Component({
  selector: 'app-card-foot',
  templateUrl: './card-foot.component.html',
  styleUrls: ['./card-foot.component.css']
})
export class CardFootComponent implements OnInit {
  @Input() node: Node;
  typeInfo: TypeInfo;
  time: number;

  constructor(
    private nodeResolver: TypeService,
    private orderService: OrderService,
  ) { }

  ngOnInit() {
    this.typeInfo = this.nodeResolver.resolveTypeInfo(this.node);
    switch (this.orderService.getOrder()) {
      case Order.MTIME_ASC:
      case Order.MTIME_DESC: { this.time = this.node.mainData.mtime; break; }
      default: { this.time = this.node.mainData.ctime; }
    }
  }

}
