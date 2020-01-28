import {Component, Input, OnChanges, SimpleChanges, ViewChild, ViewContainerRef} from '@angular/core';
import {TypeService} from '../../../service/util/type.service';
import {DetailCard} from './detail-card';
import {Node} from '../../../service/node.service';

@Component({
  selector: 'app-card-detail',
  templateUrl: './detail-card.component.html',
  styleUrls: ['./detail-card.component.css']
})
export class DetailCardComponent implements OnChanges {

  @Input() node: Node;
  @ViewChild('content', { read: ViewContainerRef, static: true }) contentHost: ViewContainerRef;
  content: DetailCard;

  ngOnChanges(changes: SimpleChanges): void {
    if (this.content) { this.contentHost.remove(); }
    const factory = this.nodeResolver.getDetailCardFactory(this.node.mainData.type);
    const componentRef = this.contentHost.createComponent(factory);
    this.content = (componentRef.instance as DetailCard);
    this.content.node = this.node;
  }

  constructor(
    private nodeResolver: TypeService
  ) { }

}
