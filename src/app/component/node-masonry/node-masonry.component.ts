import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';

import {ViewService} from '../../service/view.service';
import {of, Subscription} from 'rxjs';
import {SearchFilterComponent} from '../widget/search-filter/search-filter.component';
import {MasonryComponent} from './masonry/masonry.component';
import {catchError, tap} from 'rxjs/operators';
import {NodeViewer} from '../node-viewer/node-viewer.component';
import {Filter, Node, NodeService} from '../../service/node.service';
import {OrderService} from '../../service/order.service';
import {TagSelector} from '../tag-dialog/tag-dialog.component';
import {Router} from '@angular/router';
import {ClipboardService} from '../../service/clipboard.service';
import {TypeService} from '../../service/type.service';
import {Preference} from '../../service/preference.service';

@Component({
  selector: 'app-node-masonry',
  templateUrl: './node-masonry.component.html',
  styleUrls: ['./node-masonry.component.css']
})
export class NodeMasonryComponent implements OnInit, OnDestroy {

  public filter: Filter;
  public filterFixed: boolean;
  public mainNode: Node;

  targetNodes: Node[];
  error = false;

  fetchSub: Subscription;
  otherSubs: Subscription[] = [];

  @ViewChild('searchFilter', { read: SearchFilterComponent, static: true }) searchFilter: SearchFilterComponent;
  @ViewChild('masonryRef', { read: MasonryComponent, static: true }) masonry: MasonryComponent;

  private static mergeFilter(f1: Filter, f2: Filter) {
    if (f2.conditions) { f1.conditions = f1.conditions.concat(f2.conditions); }
    if (f2.sorts) { f1.sorts = f1.sorts.concat(f2.sorts); }

    if (f2.orTags) { f1.orTags = f1.orTags.concat(f2.orTags); }
    if (f2.andTags) { f1.andTags = f1.andTags.concat(f2.andTags); }
    if (f2.notTags) { f1.notTags = f1.notTags.concat(f2.notTags); }

    if (f2.orKeywords) { f1.orKeywords = f1.orKeywords.concat(f2.orKeywords); }
    if (f2.andKeywords) { f1.andKeywords = f1.andKeywords.concat(f2.andKeywords); }
    if (f2.notKeywords) { f1.notKeywords = f1.notKeywords.concat(f2.notKeywords); }

    ['cascade', 'part', 'collection', 'nsfw', 'like', 'hide', 'types'].forEach(property => {
      f1[property] = f2[property] === undefined ? f1[property] : f2[property];
    });
  }

  click(node: Node, index: number) {
    if (this.typeService.getType(node.mainData.type).openInNewTab) {
      this.router.navigate([node.mainData.type, node.mainData.id]);
    } else {
      this.nodeViewer.openIds(index, this.masonry.items.map(item => item.data.mainData.id));
    }
  }

  clip(action: string) {
    this.handleSelectedNodes(() => true, nodes => {switch (action) {
      case 'add': this.clipboard.add(nodes); break;
      case 'remove': this.clipboard.remove(nodes); break;
      case 'set': this.clipboard.set(nodes); break;
    }});
  }
  collection(add: boolean, targetNode: Node) {
    const fixedStatus = this.clipboard.fixed;
    this.clipboard.setFixed(true);

    this.handleSelectedNodes(
      nodes => confirm(`${
        add ? 'Add' : 'Remove'
      } ${
        nodes.length === 1 ? `this item` : `these ${nodes.length} items`
      } ${
        add ? 'to' : 'from'
      } ${
        targetNode.mainData.type + '#' + targetNode.mainData.id
      }?`),
      nodes => this.nodeService.updateTags(nodes
          .filter(n => (n.mainData.user === this.view.user.id || n.mainData.permission === 'public'))
          .map(n => n.mainData.id)
        , [targetNode.mainData.id], add ? 'add' : 'remove'
      ).pipe(
        tap((ns) => {
          this.view.alert(`${
            ns.length === 1 ? `One item ` : `${ns.length} items `
          } ${
            add ? 'add to' : 'remove from'
          } ${
            targetNode.mainData.type + '#' + targetNode.mainData.id
          }.`);
        }),
        catchError(err => of(err)),
        tap(() => this.clipboard.setFixed(fixedStatus)),
      ).subscribe());
  }

  tag(tag: boolean) {
    this.tagSelector.selectTags(
      null, null, tag ? 'Add tags to selected items' : 'Remove tags from selected items'
    ).pipe(tap(tags => {
      if (!tags) { return; }
      if (tags.length) {
        this.handleSelectedNodes(() => true, nodes => this.nodeService.updateTags(nodes
            .filter(n => (n.mainData.user === this.view.user.id || n.mainData.permission === 'public'))
            .map(n => n.mainData.id)
          , tags.map(t => t.mainData.id), tag ? 'add' : 'remove'
        ).pipe(tap((ns) => {
          this.view.alert(`${ns.length === 1 ? `One item ` : `${ns.length} items `} ${tag ? 'tagged' : 'untagged'}.`);
        })).subscribe());
      } else {
        this.view.alert('Please select at least one tag.');
      }
    })).subscribe();
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
      })).subscribe());
  }
  create(type: string) {
    this.handleSelectedNodes(() => true, nodes => {
      const draft: Node = {
        mainData: {
          user: this.view.user.id,
          title: `New ${type}`,
          type: type.toLowerCase(),
          part: false,
          collection: true,
        },
        extraList: nodes
          .filter(n => (n.mainData.user === this.view.user.id || n.mainData.permission === 'public'))
          .map(node => ({node, status: 'exist'}))
      };
      this.tagSelector.selectTags(
        null, null, `Selected ${this.clipboard.length} items`
      ).subscribe(tags => {
        if (tags) {
          draft.tags = tags;
          this.preference.set('node-edit@draft', JSON.stringify(draft));
          this.router.navigate(['/node/new'], {queryParams: {draft: 1}});
        }
      });
    });
  }
  delete() {
    this.handleSelectedNodes(
      nodes => confirm(nodes.length === 1 ? `Remove this item?` : `Remove these ${nodes.length} items?`),
      nodes => this.nodeService.deleteAll(nodes.map(node => node.mainData.id)).pipe(tap(() => {
        this.view.alert(nodes.length === 1 ? `One item removed.` : `${nodes.length} items removed.`);
      })).subscribe());
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
      })).subscribe());
  }
  safe(safe: boolean) {
    this.handleSelectedNodes(
      nodes => confirm(`Mark ${nodes.length === 1 ? `this item` : `these ${nodes.length} items`} as ${safe ? 'safe' : 'unsafe'}?`),
      nodes => this.nodeService.updateAll(nodes
          .filter(n => (n.mainData.user === this.view.user.id || n.mainData.permission === 'public'))
          .map(n => { n.mainData.nsfw = !safe; return n; })
        , true
      ).pipe(tap((ns) => {
        this.view.alert(`Mark ${ns.length === 1 ? `one item ` : `${ns.length} items `} as ${safe ? 'safe' : 'unsafe'}.`);
      })).subscribe());
  }

  public fetchData() {
    if (this.fetchSub) { this.fetchSub.unsubscribe(); }
    this.error = false;

    let filter: Filter;
    if (this.filterFixed) {
      filter = JSON.parse(JSON.stringify(this.filter));
    } else {
      filter = this.searchFilter.getFilter();
      if (this.filter) {
        NodeMasonryComponent.mergeFilter(filter, this.filter);
      }
    }

    const sort = this.orderService.getSort();
    if (sort) { filter.sorts = [sort]; }

    this.fetchSub = this.nodeService.getAll(filter).pipe(
      tap(nodes => this.masonry.setItems(nodes)),
      catchError(err => {
        this.error = true;
        return of(err);
      }),
      tap(this.unsubscribe),
    ).subscribe();
  }
  stopFetchData() {
    if (this.fetchSub) {
      this.unsubscribe();
      this.view.setLoading(false);
    }
  }
  unsubscribe() {
    if (this.fetchSub) {
      this.fetchSub.unsubscribe();
      this.fetchSub = null;
    }
  }
  toggleSelectMode() {
    this.masonry.enableSelectMode(!this.masonry.selectMode);
    this.targetNodes = (this.masonry.selectMode && this.clipboard.isCollection) ? this.clipboard.get() : null;
  }
  handleSelectedNodes(confirm: (nodes: Node[]) => boolean, handler: (nodes: Node[]) => void) {
    const nodes = this.masonry.getSelectedItems();
    if (nodes.length) {
      if (!confirm || !confirm(nodes)) { return; }
      this.masonry.enableSelectMode(false);
      handler(nodes);
    } else {
      this.view.alert('Please select at least one item.');
    }
  }

  ngOnInit(): void {
    this.otherSubs.push(this.searchFilter.onChange(() => this.fetchData()));
    // this.otherSubs.push(this.view.notification('node@onchange').subscribe(() => this.fetchData()));
    this.otherSubs.push(this.view.notification('order@onchange').subscribe(() => this.fetchData()));
    this.otherSubs.push(this.view.notification('preview@onload').subscribe(() => this.masonry.layout()));
  }
  ngOnDestroy(): void {
    this.otherSubs.forEach(sub => sub.unsubscribe());
  }

  constructor(
    public view: ViewService,
    public nodeViewer: NodeViewer,
    public clipboard: ClipboardService,
    private nodeService: NodeService,
    private orderService: OrderService,
    private tagSelector: TagSelector,
    private typeService: TypeService,
    private preference: Preference,
    private router: Router,
  ) { }
}
