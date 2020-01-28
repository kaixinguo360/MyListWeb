import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MaterialModule} from './material.module';
import {LazyLoadImageModule} from 'ng-lazyload-image';

import {NodeCardComponent} from './type/node/card/node-card.component';
import {NodeExtraEditComponent} from './type/node/extra-edit/node-extra-edit.component';

import {ListCardComponent} from './type/list/list-card.component';

import {ImagePreviewComponent} from './type/image/preview/image-preview.component';
import {ImageDetailComponent} from './type/image/detail/image-detail.component';
import {ImageEditComponent} from './type/image/edit/image-edit.component';

import {VideoPreviewComponent} from './type/video/preview/video-preview.component';
import {VideoDetailComponent} from './type/video/detail/video-detail.component';
import {VideoEditComponent} from './type/video/edit/video-edit.component';

@NgModule({
  declarations: [
    NodeCardComponent,
    NodeExtraEditComponent,
    ListCardComponent,
    ImagePreviewComponent,
    ImageDetailComponent,
    ImageEditComponent,
    VideoPreviewComponent,
    VideoDetailComponent,
    VideoEditComponent,
  ],
  entryComponents: [
    NodeCardComponent,
    NodeExtraEditComponent,
    ListCardComponent,
    ImagePreviewComponent,
    ImageDetailComponent,
    ImageEditComponent,
    VideoPreviewComponent,
    VideoDetailComponent,
    VideoEditComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    LazyLoadImageModule,
  ]
})
export class ContentModule { }
