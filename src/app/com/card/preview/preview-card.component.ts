import {Component, Input, OnChanges, SimpleChanges, ViewChild, ViewContainerRef} from '@angular/core';
import {PreviewCard} from './preview-card';
import {TypeService} from '../../../service/util/type.service';
import {Node} from '../../../service/node.service';

@Component({
  selector: 'app-card-preview',
  templateUrl: './preview-card.component.html',
  styleUrls: ['./preview-card.component.css']
})
export class PreviewCardComponent implements OnChanges {

  @Input() node: Node;
  @ViewChild('content', { read: ViewContainerRef, static: true }) contentHost: ViewContainerRef;
  content: PreviewCard;

  ngOnChanges(changes: SimpleChanges): void {
    if (this.content) { this.contentHost.remove(); }
    const factory = this.typeService.getPreviewCardFactory(this.node.mainData.type);
    const componentRef = this.contentHost.createComponent(factory);
    this.content = (componentRef.instance as PreviewCard);
    this.content.node = this.node;
  }

  constructor(
    private typeService: TypeService
  ) { }

}
