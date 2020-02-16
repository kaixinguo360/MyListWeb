import {Component, Injectable, Input, OnInit} from '@angular/core';
import {NodeChangeEvent, NodeService} from '../../service/node.service';
import {filter, tap} from 'rxjs/operators';
import {ViewService} from '../../service/util/view.service';
import {Node} from '../../service/util/node';
import {Overlay} from '@angular/cdk/overlay';
import {ComponentPortal} from '@angular/cdk/portal';
import {OverlayRef} from '@angular/cdk/overlay/typings/overlay-ref';
import {NavigationStart, Router} from '@angular/router';

@Component({
  selector: 'app-card-viewer',
  templateUrl: './node-viewer.component.html',
  styleUrls: ['./node-viewer.component.css']
})
export class NodeViewerComponent implements OnInit {

  @Input() index: number;
  @Input() ids: number[];

  showLeftButton = false;
  showRightButton = false;
  showInfo = true;
  expandInfo = false;
  canWrite: boolean;
  currentNode: Node = null;

  overlayRef: OverlayRef;

  turnPage(num: number) {
    this.index = (this.index + this.ids.length + Math.round(num)) % this.ids.length;
    this.load();
  }
  close() {
    this.nodeViewer.close(this.overlayRef);
  }
  private load() {
    const id = this.ids[this.index];
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
      const id = this.ids[this.index + i];
      if (id) {
        this.nodeService.get(id).subscribe();
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
    private router: Router,
  ) {
    router.events.pipe(
      filter((event) => event instanceof NavigationStart),
      tap(() => this.close())
    ).subscribe();
    this.view.notification('node@onchange').subscribe((event: NodeChangeEvent) => {
      if (event.action === 'delete') {
        this.ids = this.ids.filter(id => event.ids.indexOf(id) < 0);
        this.ids.length ? this.load() : this.close();
      }
    });
  }

}

@Injectable({
  providedIn: 'root'
})
export class NodeViewer {

  private count = 0;

  public openId(id: number) {
    const popup = this.createViewer();
    popup.ids = [id];
    popup.index = 0;
  }
  public openIds(index: number, ids: number[]) {
    const popup = this.createViewer();
    popup.ids = ids;
    popup.index = index;
  }
  private createViewer(): NodeViewerComponent {
    if (this.count === 0) { this.view.stopScroll(true); }
    this.count++;

    const overlayRef = this.overlay.create();
    const componentRef = overlayRef.attach(new ComponentPortal(NodeViewerComponent));
    componentRef.instance.overlayRef = overlayRef;

    return componentRef.instance;
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
