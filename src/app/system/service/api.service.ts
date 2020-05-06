import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
/*
  clip(action: string, nodes: Node[]): Observable<any> {
    switch (action) {
      case 'add': this.clipboard.add(nodes); break;
      case 'remove': this.clipboard.remove(nodes); break;
      case 'set': this.clipboard.set(nodes); break;
    }
    return of('success');
  }
  collection(add: boolean, targetNode: Node, nodes: Node[]): Observable<any> {
    if (
      confirm(`${
        add ? 'Add' : 'Remove'
      } ${
        nodes.length === 1 ? `this item` : `these ${nodes.length} items`
      } ${
        add ? 'to' : 'from'
      } ${
        targetNode.mainData.type + '#' + targetNode.mainData.id
      }?`)
    ) {
      const fixedStatus = this.clipboard.fixed;
      this.clipboard.setFixed(true);
      return this.nodeService.updateTags(nodes
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
          this.clipboard.setFixed(fixedStatus);
        }),
        catchError(err => {
          this.clipboard.setFixed(fixedStatus);
          return throwError(err);
        }),
      );
    } else {
      return throwError('canceled');
    }
  }

  tag(tag: boolean, nodes: Node[]): Observable<any> {
    this.tagSelector.selectTags(
      null, null, tag ? 'Add tags to selected items' : 'Remove tags from selected items'
    ).pipe(tap(tags => {
      if (!tags) { return; }
      if (tags.length) {
        this.nodeService.updateTags(nodes
            .filter(n => (n.mainData.user === this.view.user.id || n.mainData.permission === 'public'))
            .map(n => n.mainData.id)
          , tags.map(t => t.mainData.id), tag ? 'add' : 'remove'
        ).pipe(tap((ns) => {
          this.view.alert(`${ns.length === 1 ? `One item ` : `${ns.length} items `} ${tag ? 'tagged' : 'untagged'}.`);
        })).subscribe();
      } else {
        this.view.alert('Please select at least one tag.');
      }
    })).subscribe();
  }
  permission(permission: string, nodes: Node[]): Observable<any> {
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
  delete(nodes: Node[]): Observable<any> {
    this.handleSelectedNodes(
      nodes => confirm(nodes.length === 1 ? `Remove this item?` : `Remove these ${nodes.length} items?`),
      nodes => this.nodeService.deleteAll(nodes.map(node => node.mainData.id)).pipe(tap(() => {
        this.view.alert(nodes.length === 1 ? `One item removed.` : `${nodes.length} items removed.`);
      })).subscribe());
  }

  star(star: boolean, nodes: Node[]): Observable<any> {
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
  hide(hide: boolean, nodes: Node[]): Observable<any> {
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
  safe(safe: boolean, nodes: Node[]): Observable<any> {
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

  constructor(
    public view: ViewService,
    public clipboard: ClipboardService,
    private nodeService: NodeService,
    private tagSelector: TagSelector,
  ) { }
*/
}
