import {Component, Injectable, Input, OnInit} from '@angular/core';
import {NodeService} from '../../service/node.service';
import {tap} from 'rxjs/operators';
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

  overlayRef: OverlayRef;
  showLeftButton = false;
  showRightButton = false;
  showDetail = false;
  canWrite: boolean;
  currentNode: Node = null;

  public turnPage(num: number) {
    this.index = (this.index + this.nodes.length + Math.round(num)) % this.nodes.length;
    this.load();
  }
  private load() {
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
    this.canWrite = NodeService.canWrite(node, this.view.user);
  }

  public ngOnInit() {
    this.load();
  }

  constructor(
    public view: ViewService,
    public nodeViewer: NodeViewer,
    private nodeService: NodeService,
  ) { }

}

@Injectable({
  providedIn: 'root'
})
export class NodeViewer {

  private count = 0;

  public open(node: Node, nodes?: Node[]) {
    if (this.count === 0) { this.view.stopScroll(true); }

    this.count++;
    const overlayRef = this.overlay.create();
    const componentRef = overlayRef.attach(new ComponentPortal(NodeViewerComponent));

    const popup = (componentRef.instance as NodeViewerComponent);
    popup.overlayRef = overlayRef;
    if (nodes) {
      popup.nodes = nodes;
      popup.index = nodes.findIndex(n => n === node);
    } else {
      popup.nodes = [node];
      popup.index = 0;
    }
  }
  public close(overlayRef: OverlayRef) {
    overlayRef.dispose();
    this.count--;
    if (this.count === 0) { this.view.stopScroll(false); }
  }

  constructor(
    public view: ViewService,
    private nodeService: NodeService,
    private overlay: Overlay,
  ) { }
}
