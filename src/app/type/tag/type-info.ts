import {TagPreviewComponent} from './preview/tag-preview.component';
import {TypeDefinition} from '../../service/type.service';
import {TagDetailComponent} from './detail/tag-detail.component';

export const TagType: TypeDefinition = {
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
