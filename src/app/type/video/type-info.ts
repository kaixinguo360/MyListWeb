import {ExtraData, Node} from '../../service/util/node';
import {VideoPreviewComponent} from './preview/video-preview.component';
import {VideoEditComponent} from './edit/video-edit.component';
import {VideoDetailComponent} from './detail/video-detail.component';
import {TypeInfo} from '../../service/util/type.service';

export class Video extends ExtraData {
  url: string;
  format: string;
}

export const VideoType: TypeInfo = {
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
