import {Component, Injectable, Input, OnInit} from '@angular/core';
import {Node, NodeChangeEvent, NodeService} from '../../service/node.service';
import {tap} from 'rxjs/operators';
import {ViewService} from '../../service/view.service';
import {Overlay} from '@angular/cdk/overlay';
import {ComponentPortal} from '@angular/cdk/portal';
import {OverlayRef} from '@angular/cdk/overlay/typings/overlay-ref';
import {LocationStrategy} from '@angular/common';
import {Preference} from '../../service/preference.service';
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
  toggleExpandInfo() {
    if (this.expandInfo) {
      this.expandInfo = false;
      this.preference.remove('node-viewer@expandInfo');
    } else {
      this.showInfo = false;
      this.preference.remove('node-viewer@showInfo');
    }
  }

  close() {
    const openedViewers = this.nodeViewer.openedViewers;
    const index = openedViewers.findIndex(n => n === this);
    if (index >= 0 && index < openedViewers.length) {
      openedViewers[index].overlayRef.dispose();
      openedViewers.splice(index, 1);
    }
    if (openedViewers.length === 0) {
      this.view.stopScroll(false);
    }
  }

  private load() {
    const id = this.ids[this.index];
    this.currentNode = null;
    this.nodeService.get(id).pipe(
      tap(n => {
        this.showNode(n);
        this.preload();
      })
    ).subscribe();
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
    this.showInfo = Boolean(this.preference.get('node-viewer@showInfo'));
    this.expandInfo = Boolean(this.preference.get('node-viewer@expandInfo'));
    this.load();
  }

  constructor(
    public view: ViewService,
    public preference: Preference,
    public nodeViewer: NodeViewer,
    public location: LocationStrategy,
    private nodeService: NodeService,
  ) {
    this.view.notification('node@onchange').subscribe((event: NodeChangeEvent) => {
      if (event.deleted) {
        this.ids = this.ids.filter(id => event.deleted.indexOf(id) < 0);
        this.ids.length ? this.load() : this.close();
      }
    });
    this.view.notification('node-viewer@closeAll').subscribe(() => this.close());
  }

}

@Injectable({
  providedIn: 'root'
})
export class NodeViewer {

  public openedViewers: NodeViewerComponent[] = [];

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
    history.pushState(null, 'Node Viewer', location.href);

    const overlayRef = this.overlay.create();
    const componentRef = overlayRef.attach(new ComponentPortal(NodeViewerComponent));
    componentRef.instance.overlayRef = overlayRef;

    if (this.openedViewers.length === 0) {
      this.view.stopScroll(true);
    }
    this.openedViewers.push(componentRef.instance);

    return componentRef.instance;
  }

  constructor(
    public view: ViewService,
    private nodeService: NodeService,
    private overlay: Overlay,
    private location: LocationStrategy,
    private router: Router,
  ) {
    location.onPopState((e) => {
      if (e instanceof PopStateEvent && this.openedViewers.length) {
        this.openedViewers[this.openedViewers.length - 1].close();
      }
    });
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.view.notify('node-viewer@closeAll');
      }
    });
  }
}
