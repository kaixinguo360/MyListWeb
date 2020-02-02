import {Component, OnInit, ViewChild} from '@angular/core';
import {FilterSelectorComponent} from '../../component/filter-selector/filter-selector.component';
import {ViewService} from '../../service/util/view.service';
import {catchError, tap} from 'rxjs/operators';
import {Subscription, throwError} from 'rxjs';
import {MasonryComponent} from '../../component/masonry/masonry.component';
import {NodeService} from '../../service/node.service';
import {Node} from '../../service/util/node';

@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.css']
})
export class UserHomeComponent implements OnInit {

  error = false;
  sub: Subscription;
  @ViewChild('filter', { read: FilterSelectorComponent, static: true }) filter: FilterSelectorComponent;
  @ViewChild('masonry', { read: MasonryComponent, static: true }) masonry: MasonryComponent;

  fetchData() {
    if (this.sub) { this.sub.unsubscribe(); }
    this.error = false;
    this.sub = this.nodeService.getAll(this.filter.getFilter()).pipe(
      tap(nodes => this.masonry.setNodes(nodes)),
      catchError(err => {
        this.error = false;
        return throwError(err);
      })
    ).subscribe();
  }
  tag() {
    this.handleSelectedNodes(nodes => true, nodes => {});
  }
  star(star: boolean) {
    this.handleSelectedNodes(
      nodes => confirm(`${star ? 'Star' : 'Unstar'} ${nodes.length === 1 ? `this item` : `these ${nodes.length} items`}?`),
      nodes => this.nodeService.updateAll(nodes
        .filter(n => (n.mainData.user === this.view.user.id || n.mainData.permission === 'public'))
        .map(n => { n.mainData.like = star; return n; })
        , true
      ).pipe(tap((ns) => {
        this.view.alert(`${ns.length === 1 ? `One item ` : `${ns.length} items `} ${star ? 'starred' : 'unstarred'}.`);
        this.fetchData();
      })).subscribe());
  }
  hide(hide: boolean) {
    this.handleSelectedNodes(
      nodes => confirm(`${hide ? 'Hide' : 'Unhide'} ${nodes.length === 1 ? `this item` : `these ${nodes.length} items`}?`),
      nodes => this.nodeService.updateAll(nodes
        .filter(n => (n.mainData.user === this.view.user.id || n.mainData.permission === 'public'))
        .map(n => { n.mainData.hide = hide; return n; })
        , true
      ).pipe(tap((ns) => {
        this.view.alert(`${ns.length === 1 ? `One item ` : `${ns.length} items `} ${hide ? 'hidden' : 'unhide'}.`);
        this.fetchData();
      })).subscribe());
  }
  permission(permission: string) {
    this.handleSelectedNodes(
      nodes => confirm(`Set ${nodes.length === 1 ? `this item` : `these ${nodes.length} items`} to ${permission}?`),
      nodes => this.nodeService.updateAll(nodes
          .filter(n => (n.mainData.user === this.view.user.id || n.mainData.permission === 'public'))
          .map(n => { n.mainData.permission = permission; return n; })
        , true
      ).pipe(tap((ns) => {
        this.view.alert(`${ns.length === 1 ? `One item ` : `${ns.length} items `} set to ${permission}.`);
        this.fetchData();
      })).subscribe());
  }
  delete() {
    this.handleSelectedNodes(
      nodes => confirm(nodes.length === 1 ? `Remove this item?` : `Remove these ${nodes.length} items?`),
      nodes => this.nodeService.removeAll(nodes.map(node => node.mainData.id)).pipe(tap(() => {
        this.view.alert(nodes.length === 1 ? `One item removed.` : `${nodes.length} items removed.`);
        this.fetchData();
      })).subscribe());
  }
  private handleSelectedNodes(confirm: (nodes: Node[]) => boolean, handler: (nodes: Node[]) => void) {
    const nodes = this.masonry.getSelectedItems();
    if (nodes.length) {
      if (!confirm || !confirm(nodes)) { return; }
      this.masonry.enableSelectMode(false);
      handler(nodes);
    } else {
      this.view.alert('Please select at least one item.');
    }
  }

  constructor(
    public view: ViewService,
    private nodeService: NodeService,
  ) { }

  ngOnInit(): void {
    this.view.init({title: 'Home'});
    this.filter.onChange(() => this.fetchData());
    this.fetchData();
  }
}
