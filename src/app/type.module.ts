import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MaterialModule} from './material.module';
import {LazyLoadImageModule} from 'ng-lazyload-image';

import {DetailComponent} from './component/content/detail/detail.component';
import {PreviewComponent} from './component/content/preview/preview.component';
import {DomainPipe, LimitPipe} from './service/util/pipes';

import {NodeContentComponent} from './type/node/content/node-content.component';
import {NodeExtraEditComponent} from './type/node/extra-edit/node-extra-edit.component';

import {ListContentComponent} from './type/list/content/list-content.component';
import {TagContentComponent} from './type/tag/tag-content.component';

import {ImagePreviewComponent} from './type/image/preview/image-preview.component';
import {ImageDetailComponent} from './type/image/detail/image-detail.component';
import {ImageEditComponent} from './type/image/edit/image-edit.component';

import {VideoPreviewComponent} from './type/video/preview/video-preview.component';
import {VideoDetailComponent} from './type/video/detail/video-detail.component';
import {VideoEditComponent} from './type/video/edit/video-edit.component';

import {ListEditComponent} from './type/list/edit/list-edit.component';
import {RouterModule} from '@angular/router';

@NgModule({
  declarations: [
    PreviewComponent,
    DetailComponent,
    DomainPipe,
    LimitPipe,
    NodeContentComponent,
    NodeExtraEditComponent,
    ListContentComponent,
    TagContentComponent,
    ImagePreviewComponent,
    ImageDetailComponent,
    ImageEditComponent,
    VideoPreviewComponent,
    VideoDetailComponent,
    VideoEditComponent,
    ListEditComponent,
  ],
  entryComponents: [
    NodeContentComponent,
    NodeExtraEditComponent,
    ListContentComponent,
    TagContentComponent,
    ImagePreviewComponent,
    ImageDetailComponent,
    ImageEditComponent,
    VideoPreviewComponent,
    VideoDetailComponent,
    VideoEditComponent,
    ListEditComponent,
  ],
  exports: [
    PreviewComponent,
    DetailComponent,
    DomainPipe,
    LimitPipe,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    LazyLoadImageModule,
    RouterModule
  ]
})
export class TypeModule { }
