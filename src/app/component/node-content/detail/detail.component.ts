import {Component, Input, OnChanges, SimpleChanges, ViewChild, ViewContainerRef} from '@angular/core';
import {Detail} from './detail';
import {TypeService} from '../../../service/type.service';
import {Node} from '../../../service/node.service';

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
