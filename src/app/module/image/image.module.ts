import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ImageSearchComponent} from './image-search/image-search.component';
import {MaterialModule} from '../../system/material.module';
import {ComponentModule} from '../../system/component/component.module';
import {LazyLoadImageModule} from 'ng-lazyload-image';
import {ImageCardComponent} from './image-card/image-card.component';

@NgModule({
  declarations: [
    ImageSearchComponent,
    ImageCardComponent,
  ],
  imports: [
    CommonModule,
    ComponentModule,
    MaterialModule,
    LazyLoadImageModule,
  ]
})
export class ImageModule { }
