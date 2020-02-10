import {Component, Input, OnChanges, SimpleChanges, ViewChild, ViewContainerRef} from '@angular/core';
import {Preview} from './preview';
import {Node} from '../../../service/util/node';
import {TypeService} from '../../../service/util/type.service';

@Component({
  selector: 'app-card-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css']
})
export class PreviewComponent implements OnChanges {

  @Input() node: Node;
  @Input() lazyload = false;
  @ViewChild('content', { read: ViewContainerRef, static: true }) contentHost: ViewContainerRef;
  content: Preview;

  ngOnChanges(changes: SimpleChanges): void {
    if (this.content) { this.contentHost.remove(); }
    const factory = this.typeService.getPreviewCardFactory(this.node.mainData.type);
    const componentRef = this.contentHost.createComponent(factory);
    this.content = (componentRef.instance as Preview);
    this.content.node = this.node;
    this.content.lazyload = this.lazyload;
  }

  constructor(
    private typeService: TypeService
  ) { }

}
