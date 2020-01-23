import {TypeInfo} from '../service/type.service';
import {ListPreviewComponent} from './list-preview/list-preview.component';
import {NodePreviewComponent} from './node-preview/node-preview.component';
import {ImagePreviewComponent} from './image-preview/image-preview.component';
import {VideoPreviewComponent} from './video-preview/video-preview.component';
import {ImageDetailComponent} from './image-detail/image-detail.component';
import {VideoDetailComponent} from './video-detail/video-detail.component';

export const TypeInfos: Map<string, TypeInfo> = new Map<string, TypeInfo>();

TypeInfos.set('default', {
  name: 'Unknown',
  id: 'file',
  preview: NodePreviewComponent,
  detail: NodePreviewComponent,
  icon: 'insert_drive_file',
});
TypeInfos.set('node', {
  name: 'Node',
  id: 'node',
  preview: NodePreviewComponent,
  detail: NodePreviewComponent,
  icon: 'insert_drive_file',
});
TypeInfos.set('list', {
  name: 'List',
  id: 'list',
  preview: ListPreviewComponent,
  detail: ListPreviewComponent,
  icon: 'folder',
});
TypeInfos.set('tag', {
  name: 'Tag',
  id: 'tag',
  preview: NodePreviewComponent,
  detail: NodePreviewComponent,
  icon: 'insert_drive_file',
});
TypeInfos.set('text', {
  name: 'Text',
  id: 'text',
  preview: ImagePreviewComponent,
  detail: ImageDetailComponent,
  icon: 'book',
});
TypeInfos.set('image', {
  name: 'Image',
  id: 'image',
  preview: ImagePreviewComponent,
  detail: ImageDetailComponent,
  icon: 'image',
});
TypeInfos.set('music', {
  name: 'Music',
  id: 'music',
  preview: ImagePreviewComponent,
  detail: ImageDetailComponent,
  icon: 'music_video',
});
TypeInfos.set('video', {
  name: 'Video',
  id: 'video',
  preview: VideoPreviewComponent,
  detail: VideoDetailComponent,
  icon: 'videocam',
});
