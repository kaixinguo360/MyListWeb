import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';

import {MaterialModule} from '../material.module';
import {ComponentModule} from '../component/component.module';

import {NodeContentComponent} from './node/content/node-content.component';

import {ListPreviewComponent} from './list/preview/list-preview.component';
import {TagContentComponent} from './tag/tag-content.component';

import {ImagePreviewComponent} from './image/preview/image-preview.component';
import {ImageDetailComponent} from './image/detail/image-detail.component';
import {ImageEditComponent} from './image/edit/image-edit.component';

import {VideoPreviewComponent} from './video/preview/video-preview.component';
import {VideoDetailComponent} from './video/detail/video-detail.component';
import {VideoEditComponent} from './video/edit/video-edit.component';

import {ListEditComponent} from './list/edit/list-edit.component';
import {ImageQuickEditComponent} from './image/quick-edit/image-quick-edit.component';
import {ListDetailComponent} from './list/detail/list-detail.component';
import {LazyLoadImageModule} from 'ng-lazyload-image';

@NgModule({
  declarations: [
    NodeContentComponent,
    ListPreviewComponent,
    ListDetailComponent,
    TagContentComponent,
    ImagePreviewComponent,
    ImageDetailComponent,
    ImageEditComponent,
    ImageQuickEditComponent,
    VideoPreviewComponent,
    VideoDetailComponent,
    VideoEditComponent,
    ListEditComponent,
  ],
  entryComponents: [
    NodeContentComponent,
    ListPreviewComponent,
    ListDetailComponent,
    TagContentComponent,
    ImagePreviewComponent,
    ImageDetailComponent,
    ImageEditComponent,
    ImageQuickEditComponent,
    VideoPreviewComponent,
    VideoDetailComponent,
    VideoEditComponent,
    ListEditComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    ComponentModule,
    LazyLoadImageModule,
  ]
})
export class TypeModule { }
