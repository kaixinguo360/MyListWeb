import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {LayoutModule} from '@angular/cdk/layout';
import {NgxMasonryModule} from 'ngx-masonry';
import {BrowserModule, HAMMER_GESTURE_CONFIG, HammerGestureConfig} from '@angular/platform-browser';
import * as Hammer from 'hammerjs';
import {ServiceWorkerModule} from '@angular/service-worker';

import {environment} from '../environments/environment';
import {AppRoutingModule} from './app-routing.module';
import {MaterialModule} from './material.module';
import {TypeModule} from './type.module';

import {RootComponent} from './page/root.component';
import {LoginComponent} from './page/login/login.component';

import {MasonryItemComponent} from './component/masonry/item/masonry-item.component';
import {MasonryComponent} from './component/masonry/masonry.component';
import {CardViewerComponent} from './component/node-viewer/card-viewer.component';
import {OrderSelectorComponent} from './component/order-selector/order-selector.component';
import {FilterSelectorComponent} from './component/filter-selector/filter-selector.component';
import {PreviewCardComponent} from './component/card/preview/preview-card.component';
import {DetailCardComponent} from './component/card/detail/detail-card.component';
import {AdminHomeComponent} from './page/admin/home/admin-home.component';
import {UserHomeComponent} from './page/user-home/user-home.component';
import {UserEditComponent} from './page/admin/user-edit/user-edit.component';
import {NodeEditComponent} from './page/node-edit/node-edit.component';
import {ExtraEditComponent} from './component/extra-edit/extra-edit.component';
import {MasonryMenuComponent} from './component/masonry/menu/masonry-menu.component';
import {TagSelectorComponent} from './component/tag-selector/tag-selector.component';

export class HammerConfig extends HammerGestureConfig  {
  buildHammer(element: HTMLElement) { return new Hammer(element, { touchAction: 'pan-y' }); }
}

@NgModule({
  declarations: [
    RootComponent,
    LoginComponent,
    MasonryItemComponent,
    MasonryComponent,
    CardViewerComponent,
    OrderSelectorComponent,
    FilterSelectorComponent,
    PreviewCardComponent,
    DetailCardComponent,
    AdminHomeComponent,
    UserHomeComponent,
    UserEditComponent,
    NodeEditComponent,
    ExtraEditComponent,
    MasonryMenuComponent,
    TagSelectorComponent,
  ],
    imports: [
        BrowserModule,
        HttpClientModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        LayoutModule,
        NgxMasonryModule,
        ServiceWorkerModule.register('ngsw-worker.js', {enabled: environment.production}),
        TypeModule,
        MaterialModule,
    ],
  providers: [{
    provide: HAMMER_GESTURE_CONFIG,
    useClass: HammerConfig
  }],
  bootstrap: [ RootComponent ],
  entryComponents: [
    CardViewerComponent,
    MasonryMenuComponent,
    TagSelectorComponent,
  ]
})
export class AppModule { }
