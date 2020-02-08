import {TagContentComponent} from './tag-content.component';
import {TypeInfo} from '../../service/util/type.service';

export const TagType: TypeInfo = {
  id: 'tag',
  name: 'Tag',
  preview: TagContentComponent,
  detail: TagContentComponent,
  icon: 'style',
  process: node => {
    if (!node.mainData.title) {
      throw Error('Tag node should have a title.');
    }
  },
};
