import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {ListComponent} from './page/user/list/list.component';
import {LoginComponent} from './page/login/login.component';
import {AdminHomeComponent} from './page/admin/home/admin-home.component';
import {UserHomeComponent} from './page/user/home/user-home.component';
import {UserEditComponent} from './page/admin/user-edit/user-edit.component';
import {NodeEditComponent} from './page/user/node-edit/node-edit.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: UserHomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'node/new', component: NodeEditComponent },
  { path: 'node/:id/edit', component: NodeEditComponent },
  { path: 'list', component: ListComponent },
  { path: 'admin', redirectTo: 'admin/home', pathMatch: 'full' },
  { path: 'admin/home', component: AdminHomeComponent },
  { path: 'admin/login', component: LoginComponent },
  { path: 'admin/user/new', component: UserEditComponent },
  { path: 'admin/user/:id/edit', component: UserEditComponent },
  { path: '**', redirectTo: 'home', pathMatch: 'full' },
];

@NgModule({
  exports: [
    RouterModule,
  ],
  imports: [
    RouterModule.forRoot(routes)
  ]
})
export class AppRoutingModule { }
