import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {HAMMER_GESTURE_CONFIG, HammerGestureConfig} from '@angular/platform-browser';
import * as Hammer from 'hammerjs';
import {NgxMasonryModule} from 'ngx-masonry';

import {MaterialModule} from '../material.module';

import {DomainPipe, LimitPipe} from '../service/util/pipes';
import {DetailComponent} from './content/detail/detail.component';
import {PreviewComponent} from './content/preview/preview.component';
import {NodeCardComponent} from './node-card/node-card.component';
import {MasonryComponent} from './masonry/masonry.component';
import {NodeViewerComponent} from './node-viewer/node-viewer.component';
import {OrderFilterComponent} from './filter/order-filter/order-filter.component';
import {BasicFilterComponent} from './filter/basic-filter/basic-filter.component';
import {ExtraEditComponent} from './extra-edit/extra-edit.component';
import {NodeMenuComponent} from './node-menu/node-menu.component';
import {TagSelectorComponent} from './tag-selector/tag-selector.component';
import {TagInputComponent} from './filter/tag-filter/tag-input/tag-input.component';
import {TagFilterComponent} from './filter/tag-filter/tag-filter.component';
import {CommonModule} from '@angular/common';

export class HammerConfig extends HammerGestureConfig  {
  buildHammer(element: HTMLElement) { return new Hammer(element, { touchAction: 'pan-y' }); }
}

@NgModule({
  declarations: [
    PreviewComponent,
    DetailComponent,
    DomainPipe,
    LimitPipe,
    NodeCardComponent,
    MasonryComponent,
    NodeViewerComponent,
    OrderFilterComponent,
    BasicFilterComponent,
    ExtraEditComponent,
    NodeMenuComponent,
    TagSelectorComponent,
    TagInputComponent,
    TagFilterComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    NgxMasonryModule,
    MaterialModule,
  ],
  exports: [
    PreviewComponent,
    DetailComponent,
    DomainPipe,
    LimitPipe,
    NodeCardComponent,
    MasonryComponent,
    NodeViewerComponent,
    OrderFilterComponent,
    BasicFilterComponent,
    ExtraEditComponent,
    NodeMenuComponent,
    TagSelectorComponent,
    TagInputComponent,
    TagFilterComponent,
  ],
  providers: [{
    provide: HAMMER_GESTURE_CONFIG,
    useClass: HammerConfig
  }],
  entryComponents: [
    NodeViewerComponent,
    NodeMenuComponent,
    TagSelectorComponent
  ]
})
export class ComponentModule { }
