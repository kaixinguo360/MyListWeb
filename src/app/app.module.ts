import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {LayoutModule} from '@angular/cdk/layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxMasonryModule} from 'ngx-masonry';
import {BrowserModule, HAMMER_GESTURE_CONFIG, HammerGestureConfig} from '@angular/platform-browser';
import * as Hammer from 'hammerjs';
import {ServiceWorkerModule} from '@angular/service-worker';

import {environment} from '../environments/environment';
import {AppRoutingModule} from './app-routing.module';
import {MaterialModule} from './material.module';
import {ContentModule} from './content.module';

import {RootComponent} from './page/root/root.component';
import {ListComponent} from './page/list/list.component';
import {LoginComponent} from './page/login/login.component';

import {CardComponent} from './com/card/card.component';
import {CardFootComponent} from './com/card/card-foot/card-foot.component';
import {MasonryComponent} from './com/masonry/masonry.component';
import {NodeViewerComponent} from './com/node-viewer/node-viewer.component';
import {OrderSelectorComponent} from './com/order-selector/order-selector.component';
import {FilterComponent} from './com/filter/filter.component';

export class HammerConfig extends HammerGestureConfig  {
  buildHammer(element: HTMLElement) { return new Hammer(element, { touchAction: 'pan-y' }); }
}

@NgModule({
  declarations: [
    RootComponent,
    ListComponent,
    LoginComponent,
    CardComponent,
    CardFootComponent,
    MasonryComponent,
    NodeViewerComponent,
    OrderSelectorComponent,
    FilterComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    LayoutModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMasonryModule,
    ServiceWorkerModule.register('ngsw-worker.js', {enabled: environment.production}),
    ContentModule,
    MaterialModule,
  ],
  providers: [{
    provide: HAMMER_GESTURE_CONFIG,
    useClass: HammerConfig
  }],
  bootstrap: [ RootComponent ],
  entryComponents: [ NodeViewerComponent ]
})
export class AppModule { }
