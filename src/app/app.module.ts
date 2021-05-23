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
import {LoginComponent} from './page/login/login.component';
import {AdminHomeComponent} from './page/admin/home/admin-home.component';
import {UserHomeComponent} from './page/user-home/user-home.component';
import {UserEditComponent} from './page/admin/user-edit/user-edit.component';
import {NodeEditComponent} from './page/node-edit/node-edit.component';
import {OutsideComponent} from './page/outside/outside.component';
import {SaveComponent} from './page/save/save.component';


@NgModule({
  declarations: [
    RootComponent,
    LoginComponent,
    AdminHomeComponent,
    UserEditComponent,
    UserHomeComponent,
    NodeEditComponent,
    OutsideComponent,
    SaveComponent,
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
