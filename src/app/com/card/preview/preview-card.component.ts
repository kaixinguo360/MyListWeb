import {Component, Input, OnChanges, SimpleChanges, ViewChild, ViewContainerRef} from '@angular/core';
import {PreviewCard} from './preview-card';
import {TypeService} from '../../../service/type.service';
import {Node} from '../../../service/node/node';

@Component({
  selector: 'app-preview-card',
  templateUrl: './preview-card.component.html',
  styleUrls: ['./preview-card.component.css']
})
export class PreviewCardComponent implements OnChanges {

  @Input() node: Node;
  @ViewChild('content', { read: ViewContainerRef, static: true }) contentHost: ViewContainerRef;
  content: PreviewCard;

  ngOnChanges(changes: SimpleChanges): void {
    if (this.content) { this.contentHost.remove(); }
    const factory = this.nodeResolver.getPreviewCardFactory(this.node);
    const componentRef = this.contentHost.createComponent(factory);
    this.content = (componentRef.instance as PreviewCard);
    this.content.node = this.node;
  }

  constructor(
    private nodeResolver: TypeService
  ) { }

}
