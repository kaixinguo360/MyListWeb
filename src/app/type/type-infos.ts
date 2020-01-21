import {TypeInfo} from '../service/type.service';
import {ListPreviewComponent} from './list-preview/list-preview.component';
import {NodePreviewComponent} from './node-preview/node-preview.component';
import {ImagePreviewComponent} from './image-preview/image-preview.component';
import {VideoPreviewComponent} from './video-preview/video-preview.component';
import {NodeDetailComponent} from './node-detail/node-detail.component';
import {ImageDetailComponent} from './image-detail/image-detail.component';
import {VideoDetailComponent} from './video-detail/video-detail.component';

export const TypeInfos: Map<string, TypeInfo> = new Map<string, TypeInfo>();

TypeInfos.set('default', {
  name: 'Unknown File',
  id: 'file',
  preview: NodePreviewComponent,
  detail: NodeDetailComponent,
  icon: 'insert_drive_file',
});
TypeInfos.set('list', {
  name: 'List',
  id: 'list',
  preview: ListPreviewComponent,
  detail: ListPreviewComponent,
  icon: 'folder',
});
TypeInfos.set('image', {
  name: 'Image File',
  id: 'image',
  preview: ImagePreviewComponent,
  detail: ImageDetailComponent,
  icon: 'image',
  ext: /^(jpg|jpeg|jfif|pjpeg|pjp|png|gif|bmp|webp|apng|ico|cur|svg)$/,
});
TypeInfos.set('video', {
  name: 'Video File',
  id: 'video',
  preview: VideoPreviewComponent,
  detail: VideoDetailComponent,
  icon: 'videocam',
  ext: /^(3g2|3gp|avi|flv|h264|m4v|mkv|mov|mp4|mpg|rm|vob|wmv|rmvb|asf|divx|mpeg|mpe)$/,
});
