import {Component, Input} from '@angular/core';
import {ClipboardService} from '../../../service/util/clipboard.service';
import {Node} from '../../../service/util/node';
import {tap} from 'rxjs/operators';
import {NodeService} from '../../../service/node.service';
import {ViewService} from '../../../service/util/view.service';
import {TagSelector} from '../../tag-dialog/tag-dialog.component';
import {Preference} from '../../../service/util/preference.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-clip-menu',
  templateUrl: './clip-menu.component.html',
  styles: ['.menu-select { font-weight: bold; }']
})
export class ClipMenuComponent {

  @Input() node: Node;

  public add() {
    this.nodeService.updateTags(
      this.clipboard.get()
        .filter(n => (n.mainData.user === this.view.user.id || n.mainData.permission === 'public'))
        .map(n => n.mainData.id)
      , [this.node.mainData.id], 'add'
    ).pipe(tap((ns) => {
      this.view.alert(`${ns.length === 1 ? `One item ` : `${ns.length} items `} add to `
        + `${this.node.mainData.type}#${this.node.mainData.id}`);
    })).subscribe();
  }
  public remove() {
    const toRemove = this.clipboard.get()
      .filter(n => (n.mainData.user === this.view.user.id || n.mainData.permission === 'public'));

    if (!(toRemove.find(node => node.mainData.part) ?
        confirm(`Some selections have an auto-delete attribute. This operation may delete them. Are you sure?`) :
        confirm(`This operation will remove selected items from this collection. Are you sure?`)
    )) { return; }

    this.nodeService.updateTags(
      toRemove.map(n => n.mainData.id), [this.node.mainData.id], 'remove'
    ).subscribe((ns) => {
      this.view.alert(`${ns.length === 1 ? `One item ` : `${ns.length} items `} remove from `
        + `${this.node.mainData.type}#${this.node.mainData.id}`);
    });
  }
  public create(type: string) {
    const draft: Node = {
      mainData: {
        user: this.view.user.id,
        title: `New ${type}`,
        type: type.toLowerCase(),
        part: false,
        collection: true,
      },
      extraList: this.clipboard.get()
        .filter(n => (n.mainData.user === this.view.user.id || n.mainData.permission === 'public'))
        .map(node => ({node, status: 'exist'})),
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
  }

  constructor(
    public view: ViewService,
    public clipboard: ClipboardService,
    public preference: Preference,
    public tagSelector: TagSelector,
    private nodeService: NodeService,
    private router: Router,
  ) {}
}
