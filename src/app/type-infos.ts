import {TypeInfo} from './service/type.service';
import {ListPreviewComponent} from './type/list-preview/list-preview.component';
import {NodePreviewComponent} from './type/node-preview/node-preview.component';
import {ImagePreviewComponent} from './type/image-preview/image-preview.component';
import {VideoPreviewComponent} from './type/video-preview/video-preview.component';
import {NodeDetailComponent} from './type/node-detail/node-detail.component';
import {ImageDetailComponent} from './type/image-detail/image-detail.component';
import {VideoDetailComponent} from './type/video-detail/video-detail.component';

export const TypeInfos: Map<string, TypeInfo> = new Map<string, TypeInfo>();

TypeInfos.set('default', {
  name: 'Unknown File',
  id: 'file',
  preview: NodePreviewComponent,
  detail: NodeDetailComponent,
  icon: 'insert_drive_file',
});
TypeInfos.set('dir', {
  name: 'Directory',
  id: 'dir',
  preview: ListPreviewComponent,
  detail: ListPreviewComponent,
  icon: 'folder',
});
TypeInfos.set('img', {
  name: 'Image File',
  id: 'img',
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
