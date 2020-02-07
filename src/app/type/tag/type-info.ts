import {TagContentComponent} from './tag-content.component';
import {NodeExtraEditComponent} from '../node/extra-edit/node-extra-edit.component';
import {ViewService} from '../../service/util/view.service';
import {TypeInfo} from '../../service/util/type.service';

export const TagType: TypeInfo = {
  id: 'tag',
  name: 'Tag',
  preview: TagContentComponent,
  detail: TagContentComponent,
  extraEdit: NodeExtraEditComponent,
  icon: 'style',
  process: node => {
    if (!node.mainData.title) {
      ViewService.alert('Tag node should have a title.');
      return false;
    }
    return true;
  },
};
