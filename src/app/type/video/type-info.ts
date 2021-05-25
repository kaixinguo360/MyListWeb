import {VideoPreviewComponent} from './preview/video-preview.component';
import {VideoEditComponent} from './edit/video-edit.component';
import {VideoDetailComponent} from './detail/video-detail.component';
import {TypeDefinition} from '../../service/type.service';
import {ExtraData, Node} from '../../service/node.service';

export class Video extends ExtraData {
  url: string;
  format: string;
}

export const VideoType: TypeDefinition = {
  id: 'video',
  name: 'Video',
  openInNewTab: false,
  preview: VideoPreviewComponent,
  detail: VideoDetailComponent,
  extraEdit: VideoEditComponent,
  icon: 'videocam',
  process: (node: Node<Video>) => {
    node.mainData.excerpt = node.extraData.url;
  },
};
