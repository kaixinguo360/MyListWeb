import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MaterialModule} from './material.module';
import {LazyLoadImageModule} from 'ng-lazyload-image';

import {ListPreviewComponent} from './type/list-preview/list-preview.component';
import {NodePreviewComponent} from './type/node-preview/node-preview.component';
import {ImagePreviewComponent} from './type/image-preview/image-preview.component';
import {VideoPreviewComponent} from './type/video-preview/video-preview.component';
import {VideoDetailComponent} from './type/video-detail/video-detail.component';
import {ImageDetailComponent} from './type/image-detail/image-detail.component';

@NgModule({
  declarations: [
    ListPreviewComponent,
    NodePreviewComponent,
    ImagePreviewComponent,
    VideoPreviewComponent,
    ImageDetailComponent,
    VideoDetailComponent,
  ],
  entryComponents: [
    ListPreviewComponent,
    NodePreviewComponent,
    ImagePreviewComponent,
    VideoPreviewComponent,
    ImageDetailComponent,
    VideoDetailComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    LazyLoadImageModule,
  ],
})
export class ContentModule { }
