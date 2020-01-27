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
import {ListComponent} from './page/user/list/list.component';
import {LoginComponent} from './page/login/login.component';

import {MasonryItemComponent} from './com/masonry/masonry-item.component';
import {MasonryComponent} from './com/masonry/masonry.component';
import {CardViewerComponent} from './com/node-viewer/card-viewer.component';
import {OrderSelectorComponent} from './com/order-selector/order-selector.component';
import {FilterComponent} from './com/filter/filter.component';
import {PreviewCardComponent} from './com/card/preview/preview-card.component';
import {DetailCardComponent} from './com/card/detail/detail-card.component';
import {AdminHomeComponent} from './page/admin/home/admin-home.component';
import {UserHomeComponent} from './page/user/home/user-home.component';
import {MatTableModule} from '@angular/material';
import {UserEditComponent} from './page/admin/user-edit/user-edit.component';

export class HammerConfig extends HammerGestureConfig  {
  buildHammer(element: HTMLElement) { return new Hammer(element, { touchAction: 'pan-y' }); }
}

@NgModule({
  declarations: [
    RootComponent,
    ListComponent,
    LoginComponent,
    MasonryItemComponent,
    MasonryComponent,
    CardViewerComponent,
    OrderSelectorComponent,
    FilterComponent,
    PreviewCardComponent,
    DetailCardComponent,
    AdminHomeComponent,
    UserHomeComponent,
    UserEditComponent,
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
    MatTableModule
  ],
  providers: [{
    provide: HAMMER_GESTURE_CONFIG,
    useClass: HammerConfig
  }],
  bootstrap: [ RootComponent ],
  entryComponents: [ CardViewerComponent ]
})
export class AppModule { }
