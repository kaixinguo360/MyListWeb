import {TagPreviewComponent} from './preview/tag-preview.component';
import {TypeInfo} from '../../service/util/type.service';
import {TagDetailComponent} from './detail/tag-detail.component';

export const TagType: TypeInfo = {
  id: 'tag',
  name: 'Tag',
  openInNewTab: true,
  preview: TagPreviewComponent,
  detail: TagDetailComponent,
  icon: 'style',
  process: node => {
    if (!node.mainData.title) {
      throw Error('Tag node should have a title.');
    }
  },
};
