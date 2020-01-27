import {TypeInfo} from '../service/util/type.service';
import {ListCardComponent} from './list/list-card.component';
import {NodeCardComponent} from './node/node-card.component';
import {ImagePreviewComponent} from './image/preview/image-preview.component';
import {VideoPreviewComponent} from './video/preview/video-preview.component';
import {ImageDetailComponent} from './image/detail/image-detail.component';
import {VideoDetailComponent} from './video/detail/video-detail.component';

export const TypeConfig: TypeInfo[] = [
  {
    id: 'default',
    name: 'Unknown',
    preview: NodeCardComponent,
    detail: NodeCardComponent,
    icon: 'insert_drive_file',
  },
  {
    id: 'node',
    name: 'Simple Node',
    preview: NodeCardComponent,
    detail: NodeCardComponent,
    icon: 'insert_drive_file',
  },
  {
    id: 'list',
    name: 'List',
    preview: ListCardComponent,
    detail: ListCardComponent,
    icon: 'folder',
  },
  {
    id: 'tag',
    name: 'Tag',
    preview: NodeCardComponent,
    detail: NodeCardComponent,
    icon: 'insert_drive_file',
  },
  {
    id: 'text',
    name: 'Text',
    preview: ImagePreviewComponent,
    detail: ImageDetailComponent,
    icon: 'book',
  },
  {
    id: 'image',
    name: 'Image',
    preview: ImagePreviewComponent,
    detail: ImageDetailComponent,
    icon: 'image',
  },
  {
    id: 'music',
    name: 'Music',
    preview: ImagePreviewComponent,
    detail: ImageDetailComponent,
    icon: 'music_video',
  },
  {
    id: 'video',
    name: 'Video',
    preview: VideoPreviewComponent,
    detail: VideoDetailComponent,
    icon: 'videocam',
  }
];
