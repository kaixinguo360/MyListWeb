import {Component} from '@angular/core';
import {ExtraEdit} from '../../../component/extra-edit/extra-edit';
import {of, Subscription} from 'rxjs';
import {ListItem, Node} from '../../../service/util/node';
import {ViewService} from '../../../service/util/view.service';
import {Image} from '../../image/image';
import {NodeService} from '../../../service/node.service';

@Component({
  selector: 'app-album-edit',
  templateUrl: './album-edit.component.html',
  styleUrls: ['./album-edit.component.css']
})
export class AlbumEditComponent implements ExtraEdit {

  items: ListItem<Image>[] = [];

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
          linkDelete: true,
          linkVirtual: false,
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
  canWrite(node: Node): boolean {
    return NodeService.canWrite(node, this.view.user);
  }

  constructor(
    public view: ViewService,
  ) { }

}
