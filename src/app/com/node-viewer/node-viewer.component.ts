import {Component, ComponentFactoryResolver, Injectable, Input, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {Node, NodeService} from '../../service/node.service';
import {TypeService} from '../../service/type.service';
import {ContentDetail} from '../../type/content-detail';
import {tap} from 'rxjs/operators';

@Component({
  selector: 'app-file-tabs',
  templateUrl: './node-viewer.component.html',
  styleUrls: ['./node-viewer.component.css']
})
export class NodeViewerComponent implements OnInit {
  @Input() index: number;
  @Input() nodes: Node[];
  @ViewChild('content', { read: ViewContainerRef, static: true }) contentHost: ViewContainerRef;
  private content: ContentDetail;
  showLeftButton = false;
  showRightButton = false;
  loading = true;
  window = window;

  public turnPage(num: number) {
    this.index = (this.index + this.nodes.length + Math.round(num)) % this.nodes.length;
    this.load();
  }
  private load() {
    if (this.content) { this.contentHost.remove(); }
    const id = this.nodes[this.index].mainData.id;
    const cache = this.nodeService.getCache(id);
    if (cache != null) {
      this.showNode(cache);
      this.preload();
    } else {
      this.loading = true;
      this.nodeService.get(id).pipe(
        tap(n => {
          this.showNode(n);
          this.preload();
        })
      ).subscribe();
    }
  }
  private preload() {
    for (let i = -5; i <= 5; i++) {
      const node = this.nodes[this.index + i];
      if (node) {
        this.nodeService.get(node.mainData.id).subscribe();
      }
    }
  }
  private showNode(node: Node) {
    this.loading = false;
    const factory = this.typeResolver.resolveContentDetailFactory(node);
    const componentRef = this.contentHost.createComponent(factory);
    this.content = (componentRef.instance as ContentDetail);
    this.content.node = node;
  }

  constructor(
    public fileViewer: NodeViewer,
    private typeResolver: TypeService,
    private nodeService: NodeService,
  ) { }

  public ngOnInit() {
    this.load();
  }

}

@Injectable({
  providedIn: 'root'
})
export class NodeViewer {
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
