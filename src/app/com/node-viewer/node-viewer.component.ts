import {Component, ComponentFactoryResolver, Injectable, Input, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {Node} from '../../service/node.service';
import {TypeService} from '../../service/type.service';
import {ContentDetail} from '../../type/content-detail';

@Component({
  selector: 'app-file-tabs',
  templateUrl: './node-viewer.component.html',
  styleUrls: ['./node-viewer.component.css']
})
export class NodeViewerComponent implements OnInit {
  @Input() index: number;
  @Input() nodes: Node[];
  node: Node;
  @ViewChild('content', { read: ViewContainerRef, static: true }) contentHost: ViewContainerRef;
  private content: ContentDetail;
  showLeftButton = false;
  showRightButton = false;

  constructor(
    public fileViewer: FileViewer,
    private nodeResolver: TypeService,
  ) { }

  ngOnInit() {
    this.loadContent();
  }
  loadContent() {
    this.node = this.nodes[this.index];
    if (this.content) { this.contentHost.remove(); }
    const factory = this.nodeResolver.resolveContentDetailFactory(this.node);
    const componentRef = this.contentHost.createComponent(factory);
    this.content = (componentRef.instance as ContentDetail);
    this.content.node = this.node;
  }
  turnPage(num: number) {
    this.index = (this.index + this.nodes.length + Math.round(num)) % this.nodes.length;
    this.loadContent();
  }

}

@Injectable({
  providedIn: 'root'
})
export class FileViewer {
  public popupContainerRef: ViewContainerRef;
  public popup: NodeViewerComponent;

  public open(node: Node, nodes?: Node[]) {
    if (this.popup) { this.close(); }
    const factory = this.componentFactoryResolver.resolveComponentFactory(NodeViewerComponent);
    const componentRef = this.popupContainerRef.createComponent(factory);
    this.popup = (componentRef.instance as NodeViewerComponent);
    if (nodes) {
      this.popup.nodes = nodes;
      this.popup.index = nodes.findIndex(n => n === node);
    } else {
      this.popup.nodes = [node];
      this.popup.index = 0;
    }
  }
  public close() {
    this.popupContainerRef.remove();
  }

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
  ) { }
}
