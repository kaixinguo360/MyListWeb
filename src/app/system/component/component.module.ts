import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {HAMMER_GESTURE_CONFIG, HammerGestureConfig} from '@angular/platform-browser';
import * as Hammer from 'hammerjs';
import {NgxMasonryModule} from 'ngx-masonry';

import {MaterialModule} from '../material.module';

import {MasonryComponent} from './masonry/masonry.component';
import {OrderSelectorComponent} from './widget/order-selector/order-selector.component';
import {CommonModule} from '@angular/common';
import {ProxySelectorComponent} from './widget/proxy-selector/proxy-selector.component';
import {DomainPipe} from './pipe/domain-pipe';
import {LimitPipe} from './pipe/limit-pipe';

export class HammerConfig extends HammerGestureConfig  {
  buildHammer(element: HTMLElement) { return new Hammer(element, { touchAction: 'pan-y' }); }
}

@NgModule({
  declarations: [
    DomainPipe,
    LimitPipe,
    MasonryComponent,
    OrderSelectorComponent,
    ProxySelectorComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    NgxMasonryModule,
    MaterialModule,
  ],
  exports: [
    DomainPipe,
    LimitPipe,
    MasonryComponent,
    OrderSelectorComponent,
    ProxySelectorComponent,
  ],
  providers: [{
    provide: HAMMER_GESTURE_CONFIG,
    useClass: HammerConfig
  }],
})
export class ComponentModule { }
