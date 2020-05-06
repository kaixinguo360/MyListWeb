import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ServiceWorkerModule} from '@angular/service-worker';

import {environment} from '../environments/environment';
import {MaterialModule} from './material.module';
import {AppRoutingModule} from './app-routing.module';

import {RootComponent} from './page/root.component';
import {LoginComponent} from './page/login/login.component';
import {AdminHomeComponent} from './page/admin/home/admin-home.component';
import {UserHomeComponent} from './page/user-home/user-home.component';
import {UserEditComponent} from './page/admin/user-edit/user-edit.component';
import {LayoutModule} from '@angular/cdk/layout';
import {HttpClientModule} from '@angular/common/http';
import {ComponentModule} from './component/component.module';

@NgModule({
  declarations: [
    RootComponent,
    LoginComponent,
    AdminHomeComponent,
    UserEditComponent,
    UserHomeComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    LayoutModule,
    ServiceWorkerModule.register('ngsw-worker.js', {enabled: environment.production}),
    AppRoutingModule,
    MaterialModule,
    ComponentModule,
  ],
  providers: [],
  bootstrap: [RootComponent]
})
export class AppModule { }
