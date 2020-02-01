import {Component, ComponentFactoryResolver, Injectable, Input, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {Node, NodeService} from '../../service/node.service';
import {tap} from 'rxjs/operators';
import {DetailCard} from '../card/detail/detail-card';
import {ViewService} from '../../service/util/view.service';

@Component({
  selector: 'app-card-viewer',
  templateUrl: './card-viewer.component.html',
  styleUrls: ['./card-viewer.component.css']
})
export class CardViewerComponent implements OnInit {
  @Input() index: number;
  @Input() nodes: Node[];
  @ViewChild('content', { read: ViewContainerRef, static: true }) contentHost: ViewContainerRef;
  private content: DetailCard;
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

  public popupContainerRef: ViewContainerRef; // @Autowired
  public popup: CardViewerComponent;

  public open(node: Node, nodes?: Node[]) {
    if (this.popup) { this.close(); }
    const factory = this.componentFactoryResolver.resolveComponentFactory(CardViewerComponent);
    const componentRef = this.popupContainerRef.createComponent(factory);
    this.popup = (componentRef.instance as CardViewerComponent);
    if (nodes) {
      this.popup.nodes = nodes;
      this.popup.index = nodes.findIndex(n => n === node);
    } else {
      this.popup.nodes = [node];
      this.popup.index = 0;
    }
    this.view.stopScroll(true);
  }
  public close() {
    this.popupContainerRef.remove();
    this.view.stopScroll(false);
  }

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    public view: ViewService,
  ) { }
}
