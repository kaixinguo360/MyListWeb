import {Component, Injectable, Input, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {NodeService} from '../../service/node.service';
import {tap} from 'rxjs/operators';
import {Detail} from '../content/detail/detail';
import {ViewService} from '../../service/util/view.service';
import {Node} from '../../service/util/node';
import {Overlay} from '@angular/cdk/overlay';
import {ComponentPortal} from '@angular/cdk/portal';
import {OverlayRef} from '@angular/cdk/overlay/typings/overlay-ref';

@Component({
  selector: 'app-card-viewer',
  templateUrl: './node-viewer.component.html',
  styleUrls: ['./node-viewer.component.css']
})
export class NodeViewerComponent implements OnInit {

  @Input() index: number;
  @Input() nodes: Node[];

  @ViewChild('content', { read: ViewContainerRef, static: true }) contentHost: ViewContainerRef;
  private content: Detail;
  showLeftButton = false;
  showRightButton = false;
  currentNode: Node = null;
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
      this.currentNode = null;
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
    this.view.setLoading(false);
  }
  private showNode(node: Node) {
    this.currentNode = node;
  }

  constructor(
    public view: ViewService,
    public fileViewer: NodeViewer,
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

  private overlayRef: OverlayRef;

  public open(node: Node, nodes?: Node[]) {
    if (this.overlayRef) { this.close(); }

    this.overlayRef = this.overlay.create();
    const componentRef = this.overlayRef.attach(new ComponentPortal(NodeViewerComponent));

    const popup = (componentRef.instance as NodeViewerComponent);
    if (nodes) {
      popup.nodes = nodes;
      popup.index = nodes.findIndex(n => n === node);
    } else {
      popup.nodes = [node];
      popup.index = 0;
    }
    this.view.stopScroll(true);
  }
  public close() {
    this.overlayRef.dispose();
    this.view.stopScroll(false);
  }

  constructor(
    public view: ViewService,
    private overlay: Overlay,
  ) { }
}
