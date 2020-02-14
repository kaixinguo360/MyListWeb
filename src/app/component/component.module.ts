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
import {OrderSelectorComponent} from './widget/order-selector/order-selector.component';
import {BasicFilterComponent} from './widget/basic-filter/basic-filter.component';
import {ExtraEditComponent} from './edit/extra-edit/extra-edit.component';
import {NodeMenuComponent} from './node-menu/node-menu.component';
import {TagDialogComponent} from './tag-dialog/tag-dialog.component';
import {TagInputComponent} from './widget/tag-filter/tag-input/tag-input.component';
import {TagFilterComponent} from './widget/tag-filter/tag-filter.component';
import {CommonModule} from '@angular/common';
import {QuickEditComponent} from './edit/quick-edit/quick-edit.component';
import {ProxySelectorComponent} from './widget/proxy-selector/proxy-selector.component';
import {AddMenuComponent} from './widget/add-menu/add-menu.component';
import {NodeMasonryComponent} from './node-masonry/node-masonry.component';
import {ClipMenuComponent} from './widget/clip-menu/clip-menu.component';

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
    OrderSelectorComponent,
    BasicFilterComponent,
    ExtraEditComponent,
    QuickEditComponent,
    NodeMenuComponent,
    TagDialogComponent,
    TagInputComponent,
    TagFilterComponent,
    ProxySelectorComponent,
    AddMenuComponent,
    NodeMasonryComponent,
    ClipMenuComponent
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
    OrderSelectorComponent,
    BasicFilterComponent,
    ExtraEditComponent,
    QuickEditComponent,
    NodeMenuComponent,
    TagDialogComponent,
    TagInputComponent,
    TagFilterComponent,
    ProxySelectorComponent,
    AddMenuComponent,
    NodeMasonryComponent,
    ClipMenuComponent
  ],
  providers: [{
    provide: HAMMER_GESTURE_CONFIG,
    useClass: HammerConfig
  }],
  entryComponents: [
    NodeViewerComponent,
    NodeMenuComponent,
    TagDialogComponent,
    QuickEditComponent,
  ]
})
export class ComponentModule { }
