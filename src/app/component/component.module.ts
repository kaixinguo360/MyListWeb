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
import {NodeBottomSheetComponent} from './node-bottom-sheet/node-bottom-sheet.component';
import {TagDialogComponent} from './tag-dialog/tag-dialog.component';
import {KeywordInputComponent} from './widget/search-filter/keyword-input/keyword-input.component';
import {SearchFilterComponent} from './widget/search-filter/search-filter.component';
import {CommonModule} from '@angular/common';
import {QuickEditComponent} from './edit/quick-edit/quick-edit.component';
import {ProxySelectorComponent} from './widget/proxy-selector/proxy-selector.component';
import {AddMenuComponent} from './widget/add-menu/add-menu.component';
import {NodeMasonryComponent} from './node-masonry/node-masonry.component';
import {ClipMenuComponent} from './widget/clip-menu/clip-menu.component';
import {NodeMenuComponent} from './widget/node-menu/node-menu.component';

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
    NodeBottomSheetComponent,
    TagDialogComponent,
    KeywordInputComponent,
    SearchFilterComponent,
    ProxySelectorComponent,
    AddMenuComponent,
    NodeMasonryComponent,
    ClipMenuComponent,
    NodeMenuComponent
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
    NodeBottomSheetComponent,
    TagDialogComponent,
    KeywordInputComponent,
    SearchFilterComponent,
    ProxySelectorComponent,
    AddMenuComponent,
    NodeMasonryComponent,
    ClipMenuComponent,
    NodeMenuComponent
  ],
  providers: [{
    provide: HAMMER_GESTURE_CONFIG,
    useClass: HammerConfig
  }],
  entryComponents: [
    NodeViewerComponent,
    NodeBottomSheetComponent,
    TagDialogComponent,
    QuickEditComponent,
  ]
})
export class ComponentModule { }
