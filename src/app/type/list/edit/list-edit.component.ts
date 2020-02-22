import {Component} from '@angular/core';
import {ExtraEdit} from '../../../component/edit/extra-edit/extra-edit';
import {of, throwError} from 'rxjs';
import {ListItem, Node} from '../../../service/util/node';
import {ViewService} from '../../../service/util/view.service';
import {Image} from '../../image/type-info';
import {NodeService} from '../../../service/node.service';
import {catchError, tap} from 'rxjs/operators';
import {TypeService} from '../../../service/util/type.service';
import {Preference} from '../../../service/util/preference.service';
import {NodeViewer} from '../../../component/node-viewer/node-viewer.component';

@Component({
  selector: 'app-list-edit',
  templateUrl: './list-edit.component.html',
  styleUrls: ['./list-edit.component.css']
})
export class ListEditComponent implements ExtraEdit {

  items: ListItem[] = [];

  show = this.preference.switch('list-edit@show');
  loading = false;
  selectMode = false;

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
    const item: ListItem<Image> = {
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
            source: undefined,
            description: undefined,
        },
        extraData: {
          nodeType: 'image',
            url: '',
        },
      },
      status: 'new',
    };
    this.items.push(item);
  }
  openViewer(item: ListItem, index: number) {
    if (item.status === 'new') {
      this.view.alert('Unable to view an unsaved item');
    } else {
      this.nodeViewer.openIds(index, this.items.map(i => i.node.mainData.id));
    }
  }

  first(index: number) {
    this.selectMode = false;
    const items = this.items;
    [items[index], items[0]] = [items[0], items[index]];
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

  toggleEditor(editor, index: number) {
    const item = this.items[index];
    if (editor.hidden && item.status === 'exist') {
      item.status = 'loading';
      this.nodeService.get(item.node.mainData.id).pipe(
        tap(node => node.tags = undefined),
        tap(node => {
          item.node = node;
          item.status = 'update';
          editor.hidden = false;
        }),
        catchError(err => {
          item.status = 'exist';
          return of(err);
        }),
      ).subscribe();
    } else {
      editor.hidden = !editor.hidden;
      if ( editor.hidden) { this.typeService.process(item.node); }
    }
  }
  togglePartStatus(index: number) {
    const item = this.items[index];
    if (item.status !== 'exist') {
      item.node.mainData.part = !item.node.mainData.part;
    } else {
      const node: Node = JSON.parse(JSON.stringify(item.node));

      item.status = 'loading';
      node.mainData.part = !item.node.mainData.part;

      this.nodeService.updateAll([node], true).pipe(
        tap(nodes => {
          item.node.mainData.part = nodes[0].mainData.part;
          item.status = 'exist';
        }),
        catchError(err => {
          item.status = 'exist';
          return throwError(err);
        }),
      ).subscribe();
    }
  }
  toggleAllPartStatus() {
    const editableItems = this.items.filter(item => this.canWrite(item.node));
    const existItems = editableItems.filter(item => item.status === 'exist' && this.canWrite(item.node));
    const target = !editableItems.find(item => item.node.mainData.part);

    editableItems.filter(item => item.status !== 'exist').forEach(item => item.node.mainData.part = target);

    if (existItems.length) {
      this.loading = true;

      const existNodes: Node[] = existItems.map(item => JSON.parse(JSON.stringify(item.node)));
      existItems.forEach(item => item.status = 'loading');
      existNodes.forEach(node => node.mainData.part = target);

      this.nodeService.updateAll(existNodes, true).pipe(
        tap(ns => ns.forEach((node, i) => {
          existItems[i].node.mainData.part = node.mainData.part;
          existItems[i].status = 'exist';
        })),
        catchError(err => {
          editableItems.forEach((item) => item.status = 'exist');
          return of(err);
        }),
        tap(() => this.loading = false),
      ).subscribe();
    }
  }

  canWrite(node: Node): boolean {
    return NodeService.canWrite(node, this.view.user);
  }

  constructor(
    public view: ViewService,
    public nodeViewer: NodeViewer,
    public preference: Preference,
    private typeService: TypeService,
    private nodeService: NodeService,
  ) { }

}
