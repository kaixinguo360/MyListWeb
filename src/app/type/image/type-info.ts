import {ExtraData, Node} from '../../service/util/node';
import {ImageDetailComponent} from './detail/image-detail.component';
import {ImageEditComponent} from './edit/image-edit.component';
import {ImagePreviewComponent} from './preview/image-preview.component';
import {TypeInfo} from '../../service/util/type.service';
import {ImageQuickEditComponent} from './quick-edit/image-quick-edit.component';

export class Image extends ExtraData {
  url: string;
  type?: string;
  author?: string;
  gallery?: string;
  source?: string;
}

export const ImageType: TypeInfo = {
  id: 'image',
  name: 'Image',
  icon: 'image',
  detail: ImageDetailComponent,
  preview: ImagePreviewComponent,
  extraEdit: ImageEditComponent,
  quickEdit: ImageQuickEditComponent,
  process: (node: Node<Image>) => {
    node.mainData.excerpt = node.extraData.url;
  },
};
