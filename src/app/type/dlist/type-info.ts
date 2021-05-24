import {ExtraData} from '../../service/util/node';
import {DListEditComponent} from './edit/d-list-edit.component';
import {DListPreviewComponent} from './preview/d-list-preview.component';
import {TypeInfo} from '../../service/util/type.service';

export class DList extends ExtraData {
  filter: string;
}

export const DListType: TypeInfo = {
  id: 'dlist',
  name: 'DList',
  icon: 'list',
  openInNewTab: true,
  detail: DListPreviewComponent,
  preview: DListPreviewComponent,
  extraEdit: DListEditComponent,
  process: node => {
    if (!node.mainData.title) {
      throw Error('DList node should have a title.');
    }
  },
};
