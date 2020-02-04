import {Component, OnInit, ViewChild} from '@angular/core';
import {BasicFilterComponent} from '../../component/filter/basic-filter/basic-filter.component';
import {ViewService} from '../../service/util/view.service';
import {catchError, tap} from 'rxjs/operators';
import {Subscription, throwError} from 'rxjs';
import {MasonryComponent} from '../../component/masonry/masonry.component';
import {NodeService} from '../../service/node.service';
import {Node} from '../../service/util/node';
import {TagSelector} from '../../component/tag-selector/tag-selector.component';
import {TagFilterComponent} from '../../component/filter/tag-filter/tag-filter.component';
import {OrderFilterComponent} from '../../component/filter/order-filter/order-filter.component';

@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.css']
})
export class UserHomeComponent implements OnInit {

  error = false;
  sub: Subscription;
  @ViewChild('orderFilter', { read: OrderFilterComponent, static: true }) orderFilter: OrderFilterComponent;
  @ViewChild('tagFilter', { read: TagFilterComponent, static: true }) tagFilter: TagFilterComponent;
  @ViewChild('basicFilter', { read: BasicFilterComponent, static: true }) basicFilter: BasicFilterComponent;
  @ViewChild('masonry', { read: MasonryComponent, static: true }) masonry: MasonryComponent;

  fetchData() {
    if (this.sub) { this.sub.unsubscribe(); }
    this.error = false;

    const filter = this.basicFilter.getFilter();
    const tags = this.tagFilter.getTags();
    filter.orTags = tags.or;
    filter.andTags = tags.and;
    filter.notTags = tags.not;

    const sort = this.orderFilter.getSort();
    if (sort) { filter.sorts = [sort]; }

    this.sub = this.nodeService.getAll(filter).pipe(
      tap(nodes => this.masonry.setNodes(nodes)),
      catchError(err => {
        this.error = false;
        return throwError(err);
      })
    ).subscribe();
  }
  tag(tag: boolean) {
    this.tagSelector.selectTags(
      undefined, undefined, tag ? 'Add tags to selected items' : 'Remove tags from selected items'
    ).pipe(tap(tags => {
      if (!tags) { return; }
      if (tags.length) {
        this.handleSelectedNodes(() => true, nodes => this.nodeService.updateTags(nodes
            .filter(n => (n.mainData.user === this.view.user.id || n.mainData.permission === 'public'))
            .map(n => n.mainData.id)
          , tags.map(t => t.mainData.id), tag ? 'add' : 'remove'
        ).pipe(tap((ns) => {
          this.view.alert(`${ns.length === 1 ? `One item ` : `${ns.length} items `} ${tag ? 'tagged' : 'untagged'}.`);
          this.fetchData();
        })).subscribe());
      } else {
        this.view.alert('Please select at least one tag.');
      }
    })).subscribe();
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
    private tagSelector: TagSelector,
  ) { }

  ngOnInit(): void {
    this.view.init({title: 'Home'});
    this.basicFilter.onChange(() => this.fetchData());
    this.tagFilter.onChange(() => this.fetchData());
    this.orderFilter.onChange(() => this.fetchData());
    this.fetchData();
  }
}
