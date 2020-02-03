import {TypeInfo} from '../service/util/type.service';
import {ListContentComponent} from './list/list-content.component';
import {NodeContentComponent} from './node/content/node-content.component';
import {ImagePreviewComponent} from './image/preview/image-preview.component';
import {VideoPreviewComponent} from './video/preview/video-preview.component';
import {ImageDetailComponent} from './image/detail/image-detail.component';
import {VideoDetailComponent} from './video/detail/video-detail.component';
import {NodeExtraEditComponent} from './node/extra-edit/node-extra-edit.component';
import {ImageEditComponent} from './image/edit/image-edit.component';
import {VideoEditComponent} from './video/edit/video-edit.component';
import {TagContentComponent} from './tag/tag-content.component';

export const TypeConfig: TypeInfo[] = [
  {
    id: 'default',
    name: 'Unknown',
    preview: NodeContentComponent,
    detail: NodeContentComponent,
    extraEdit: NodeExtraEditComponent,
    icon: 'insert_drive_file',
  },
  {
    id: 'node',
    name: 'Simple Node',
    preview: NodeContentComponent,
    detail: NodeContentComponent,
    extraEdit: NodeExtraEditComponent,
    icon: 'insert_drive_file',
  },
  {
    id: 'list',
    name: 'List',
    preview: ListContentComponent,
    detail: ListContentComponent,
    extraEdit: NodeExtraEditComponent,
    icon: 'folder',
    process: node => { node.extraList.forEach(n => (n.status === 'new') ? (n.node.mainData.linkDelete = true) : null); },
  },
  {
    id: 'tag',
    name: 'Tag',
    preview: TagContentComponent,
    detail: TagContentComponent,
    extraEdit: NodeExtraEditComponent,
    icon: 'style',
    process: node => {
      if (!node.mainData.title) { return 'Tag node should have a title.'; }
      node.mainData.linkVirtual = true;
    },
  },
  {
    id: 'text',
    name: 'Text',
    preview: ImagePreviewComponent,
    detail: ImageDetailComponent,
    extraEdit: NodeExtraEditComponent,
    icon: 'book',
  },
  {
    id: 'image',
    name: 'Image',
    preview: ImagePreviewComponent,
    detail: ImageDetailComponent,
    extraEdit: ImageEditComponent,
    icon: 'image',
  },
  {
    id: 'music',
    name: 'Music',
    preview: ImagePreviewComponent,
    detail: ImageDetailComponent,
    extraEdit: NodeExtraEditComponent,
    icon: 'music_video',
  },
  {
    id: 'video',
    name: 'Video',
    preview: VideoPreviewComponent,
    detail: VideoDetailComponent,
    extraEdit: VideoEditComponent,
    icon: 'videocam',
  }
];
