import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';

import {MaterialModule} from '../material.module';
import {ComponentModule} from '../component/component.module';

import {NodeContentComponent} from './node/content/node-content.component';
import {NodeExtraEditComponent} from './node/extra-edit/node-extra-edit.component';

import {ListContentComponent} from './list/content/list-content.component';
import {TagContentComponent} from './tag/tag-content.component';

import {ImagePreviewComponent} from './image/preview/image-preview.component';
import {ImageDetailComponent} from './image/detail/image-detail.component';
import {ImageEditComponent} from './image/edit/image-edit.component';

import {VideoPreviewComponent} from './video/preview/video-preview.component';
import {VideoDetailComponent} from './video/detail/video-detail.component';
import {VideoEditComponent} from './video/edit/video-edit.component';

import {ListEditComponent} from './list/edit/list-edit.component';

@NgModule({
  declarations: [
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
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    ComponentModule,
  ]
})
export class TypeModule { }
