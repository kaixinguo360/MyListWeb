import {Component} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {catchError, tap} from 'rxjs/operators';
import {of, Subscription} from 'rxjs';

import {AppConfig} from '../../../environments/app-config';
import {Node} from '../../service/node.service';
import {NodeViewer} from '../../com/node-viewer/node-viewer.component';
import {ViewService} from '../../service/view.service';
import {SearchService} from '../../service/search.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent {

  id: number;
  nodes: Node[];
  sub: Subscription;
  error = false;

  updateContent(): void {
    this.error = false;
    if (this.sub) { this.sub.unsubscribe(); }
    this.nodes = null;
    let id = this.route.snapshot.queryParamMap.get('id');
    id = !id ? AppConfig.defaultId : id === '' ? AppConfig.defaultId : id;
    this.id = Number(id);
    this.sub = this.searchService.getAll().pipe(
      tap(nodes => this.nodes = nodes),
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
    private searchService: SearchService,
    private popupService: NodeViewer,
    private viewService: ViewService,
  ) {
    this.viewService.hasBackButton = false;
    this.viewService.title = 'List Page';
    this.router.events.subscribe(event => (event instanceof NavigationEnd) ? this.updateContent() : null);
  }
}
