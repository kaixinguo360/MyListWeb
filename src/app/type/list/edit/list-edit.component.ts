import {Component} from '@angular/core';
import {ExtraEdit} from '../../../component/extra-edit/extra-edit';
import {of, Subscription, throwError} from 'rxjs';
import {ListItem, Node} from '../../../service/util/node';
import {ViewService} from '../../../service/util/view.service';
import {Image} from '../../image/type-info';
import {NodeService} from '../../../service/node.service';
import {catchError, tap} from 'rxjs/operators';

@Component({
  selector: 'app-list-edit',
  templateUrl: './list-edit.component.html',
  styleUrls: ['./list-edit.component.css']
})
export class ListEditComponent implements ExtraEdit {

  items: ListItem<Image>[] = [];
  show = false;
  updating = false;

  public valid = true;
  public onChange(next: () => void): Subscription { return of().subscribe(); }
  public setExtraList(extraList: ListItem[]) {
    this.items = extraList as ListItem<Image>[];
  }
  public getExtraList(): ListItem[] {
    return this.items;
  }

  addImage() {
    if (!this.items) {
      this.items = [];
    }
    this.items.push({
      node: {
        mainData: {
          id: undefined,
          user: this.view.user.id,
          type: 'image',
          title: undefined,
          excerpt: undefined,
          part: true,
          collection: false,
          permission: 'private',
          nsfw: false,
          like: false,
          hide: false,
          sourceUrl: undefined,
          comment: undefined,
        },
        extraData: {
          type: 'image',
          url: '',
          description: '',
        },
      },
      status: 'new',
    });
  }
  up(index: number) {
    if (index <= 0) { return; }
    const items = this.items;
    [items[index], items[index - 1]] = [items[index - 1], items[index]];
  }
  down(index: number) {
    if (index + 1 >= this.items.length) { return; }
    const items = this.items;
    [items[index], items[index + 1]] = [items[index + 1], items[index]];
  }

  changePart(index: number) {
    const item = this.items[index];
    if (item.status === 'new') {
      item.node.mainData.part = !item.node.mainData.part;
    } else {
      const before = item.node.mainData.part;
      const node: Node = JSON.parse(JSON.stringify(item.node));

      item.node.mainData.part = null;
      node.mainData.part = !before;

      this.nodeService.updateAll([node], true).pipe(
        tap(nodes => item.node.mainData.part = nodes[0].mainData.part),
        catchError(err => { item.node.mainData.part = before; return throwError(err); }),
      ).subscribe();
    }
  }
  changeAllPart() {
    const editableItems = this.items.filter(item => this.canWrite(item.node));
    const existItems = editableItems.filter(item => item.status !== 'new' && this.canWrite(item.node));
    const target = !editableItems.find(item => item.node.mainData.part);

    const before = editableItems.map(item => item.node.mainData.part);
    editableItems.filter(item => item.status === 'new').forEach(item => item.node.mainData.part = target);

    if (existItems.length) {
      this.updating = true;

      const existNodes: Node[] = existItems.map(item => JSON.parse(JSON.stringify(item.node)));
      existItems.forEach(item => item.node.mainData.part = null);
      existNodes.forEach(node => node.mainData.part = target);

      this.nodeService.updateAll(existNodes, true).pipe(
        tap(ns => ns.forEach((node, i) => {
          existItems[i].node.mainData.part = node.mainData.part;
        })),
        catchError(err => {
          editableItems.forEach((item, i) => item.node.mainData.part = before[i]);
          return of(err);
        }),
        tap(() => this.updating = false),
      ).subscribe();
    }
  }

  canWrite(node: Node): boolean {
    return NodeService.canWrite(node, this.view.user);
  }

  constructor(
    public view: ViewService,
    private nodeService: NodeService,
  ) { }

}
