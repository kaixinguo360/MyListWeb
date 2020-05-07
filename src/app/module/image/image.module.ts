import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ImageSearchComponent} from './image-search/image-search.component';
import {MaterialModule} from '../../system/material.module';
import {ComponentModule} from '../../system/component/component.module';
import {LazyLoadImageModule} from 'ng-lazyload-image';
import {ImageCardComponent} from './image-card/image-card.component';
import {RouterModule} from '@angular/router';

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
        RouterModule,
    ]
})
export class ImageModule { }
