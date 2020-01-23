import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MaterialModule} from './material.module';
import {LazyLoadImageModule} from 'ng-lazyload-image';

import {NodeCardComponent} from './type/node/node-card.component';
import {ListCardComponent} from './type/list/list-card.component';
import {ImagePreviewComponent} from './type/image/preview/image-preview.component';
import {VideoPreviewComponent} from './type/video/preview/video-preview.component';
import {VideoDetailComponent} from './type/video/detail/video-detail.component';
import {ImageDetailComponent} from './type/image/detail/image-detail.component';

@NgModule({
  declarations: [
    NodeCardComponent,
    ListCardComponent,
    ImagePreviewComponent,
    VideoPreviewComponent,
    ImageDetailComponent,
    VideoDetailComponent,
  ],
  entryComponents: [
    NodeCardComponent,
    ListCardComponent,
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
