import {Component, Input, OnChanges, SimpleChanges, ViewChild, ViewContainerRef} from '@angular/core';
import {TypeService} from '../../../service/util/type.service';
import {Detail} from './detail';
import {Node} from '../../../service/util/node';

@Component({
  selector: 'app-card-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnChanges {

  @Input() node: Node;
  @ViewChild('content', { read: ViewContainerRef, static: true }) contentHost: ViewContainerRef;
  content: Detail;

  ngOnChanges(changes: SimpleChanges): void {
    if (this.content) { this.contentHost.remove(); }
    const factory = this.nodeResolver.getDetailCardFactory(this.node.mainData.type);
    const componentRef = this.contentHost.createComponent(factory);
    this.content = (componentRef.instance as Detail);
    this.content.node = this.node;
  }

  constructor(
    private nodeResolver: TypeService
  ) { }

}
