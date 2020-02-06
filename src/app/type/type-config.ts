import {TypeInfo} from '../service/util/type.service';
import {ListContentComponent} from './album/content/list-content.component';
import {NodeContentComponent} from './node/content/node-content.component';
import {ImagePreviewComponent} from './image/preview/image-preview.component';
import {VideoPreviewComponent} from './video/preview/video-preview.component';
import {ImageDetailComponent} from './image/detail/image-detail.component';
import {VideoDetailComponent} from './video/detail/video-detail.component';
import {NodeExtraEditComponent} from './node/extra-edit/node-extra-edit.component';
import {ImageEditComponent} from './image/edit/image-edit.component';
import {VideoEditComponent} from './video/edit/video-edit.component';
import {TagContentComponent} from './tag/tag-content.component';
import {AlbumEditComponent} from './album/edit/album-edit.component';

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
    preview: NodeContentComponent,
    detail: NodeContentComponent,
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
    preview: NodeContentComponent,
    detail: NodeContentComponent,
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
  },
  {
    id: 'list',
    name: 'List',
    preview: ListContentComponent,
    detail: ListContentComponent,
    extraEdit: AlbumEditComponent,
    icon: 'collections',
    process: node => {
      node.extraList.forEach(image => {
        if (image.status === 'new') {
          image.node.mainData.permission = node.mainData.permission;
          image.node.mainData.nsfw = node.mainData.nsfw;
          image.node.mainData.like = node.mainData.like;
          image.node.mainData.hide = node.mainData.hide;
          image.node.mainData.sourceUrl = node.mainData.sourceUrl;
        }
      });
    },
  }
];
