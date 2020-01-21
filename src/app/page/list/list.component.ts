import {Component, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {catchError, concatMap, tap} from 'rxjs/operators';
import {of, Subscription} from 'rxjs';

import {AppConfig} from '../../../environments/app-config';
import {Node, NodeService} from '../../service/node.service';
import {FileViewer} from '../../com/node-viewer/node-viewer.component';
import {ViewService} from '../../service/view.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  id;
  node;
  nodes: Node[] = [];
  sub: Subscription;
  error = false;
  @ViewChild('popupContainer', { read: ViewContainerRef, static: true }) popupContainerRef: ViewContainerRef;

  back() {
    window.stop();
    window.history.back();
  }
  updateContent(refresh = false): void {
    this.error = false;
    if (this.sub) { this.sub.unsubscribe(); }
    this.nodes.length = 0;
    this.id = this.route.snapshot.queryParamMap.get('id');
    this.id = !this.id ? AppConfig.defaultId : this.id === '' ? AppConfig.defaultId : this.id;
    this.node = null;
    this.sub = this.nodeService.getList(this.id, refresh).pipe(
      tap(nodes => this.nodes = nodes),
      concatMap(_ => this.nodeService.getNode(this.id)),
      tap(node => this.node = node),
      catchError(err => {
        this.error = true;
        return of(err);
      } )
    ).subscribe();
  }
  refresh() { location.reload(); }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private nodeService: NodeService,
    private popupService: FileViewer,
    private viewService: ViewService,
  ) {
    this.viewService.hasBackButton = false;
    this.viewService.title = 'List Page';
    this.router.events.subscribe(event => (event instanceof NavigationEnd) ? this.updateContent() : null);
  }

  ngOnInit() {
    this.popupService.popupContainerRef = this.popupContainerRef;
  }
}
