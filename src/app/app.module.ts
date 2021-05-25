import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {LayoutModule} from '@angular/cdk/layout';
import {BrowserModule} from '@angular/platform-browser';
import {ServiceWorkerModule} from '@angular/service-worker';

import {environment} from '../environments/environment';
import {AppRoutingModule} from './app-routing.module';
import {MaterialModule} from './material.module';
import {TypeModule} from './type/type.module';
import {ComponentModule} from './component/component.module';

import {RootComponent} from './page/root.component';
import {LoginPageComponent} from './page/user/login-page/login-page.component';
import {AdminPageComponent} from './page/admin/admin-page/admin-page.component';
import {MainPageComponent} from './page/user/main-page/main-page.component';
import {UserEditPageComponent} from './page/admin/user-edit-page/user-edit-page.component';
import {EditPageComponent} from './page/user/edit-page/edit-page.component';
import {OutsidePageComponent} from './page/user/outside-page/outside-page.component';
import {SavePageComponent} from './page/user/save-page/save-page.component';


@NgModule({
  declarations: [
    RootComponent,
    LoginPageComponent,
    AdminPageComponent,
    UserEditPageComponent,
    MainPageComponent,
    EditPageComponent,
    OutsidePageComponent,
    SavePageComponent,
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
    TypeModule,
  ],
  bootstrap: [ RootComponent ],
})
export class AppModule { }
