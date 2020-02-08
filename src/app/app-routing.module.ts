import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {LoginComponent} from './page/login/login.component';
import {AdminHomeComponent} from './page/admin/home/admin-home.component';
import {UserHomeComponent} from './page/user-home/user-home.component';
import {UserEditComponent} from './page/admin/user-edit/user-edit.component';
import {NodeEditComponent} from './page/node-edit/node-edit.component';
import {OutsideComponent} from './page/outside/outside.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: UserHomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'node/new', component: NodeEditComponent },
  { path: 'node/new/outside', component: OutsideComponent },
  { path: 'node/:id/edit', component: NodeEditComponent },
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
