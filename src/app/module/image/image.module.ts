import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ImageSearchComponent} from './image-search/image-search.component';
import {MaterialModule} from '../../system/material.module';
import {ComponentModule} from '../../system/component/component.module';
import {LazyLoadImageModule} from 'ng-lazyload-image';

@NgModule({
  declarations: [
    ImageSearchComponent,
  ],
  imports: [
    CommonModule,
    ComponentModule,
    MaterialModule,
    LazyLoadImageModule,
  ]
})
export class ImageModule { }
