import {DListEditComponent} from './edit/d-list-edit.component';
import {DListPreviewComponent} from './preview/d-list-preview.component';
import {TypeDefinition} from '../../service/type.service';
import {ExtraData} from '../../service/node.service';

export class DList extends ExtraData {
  filter: string;
}

export const DListType: TypeDefinition = {
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
