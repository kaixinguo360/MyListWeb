import {Injectable, NgModule} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterModule, RouterStateSnapshot, Routes} from '@angular/router';

import {LoginComponent} from './page/login/login.component';
import {AdminHomeComponent} from './page/admin/home/admin-home.component';
import {UserHomeComponent} from './page/user-home/user-home.component';
import {UserEditComponent} from './page/admin/user-edit/user-edit.component';
import {NodeEditComponent} from './page/node-edit/node-edit.component';
import {OutsideComponent} from './page/outside/outside.component';
import {TokenService} from './service/token.service';
import {ViewService} from './service/util/view.service';
import {SaveComponent} from './page/save/save.component';

@Injectable({providedIn: 'root'})
export class UserLoginGuard implements CanActivate {
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.tokenService.hasToken(false)) {
      return true;
    } else {
      this.view.alert('Please log in first.');
      this.router.navigate(['/login']);
    }
  }
  constructor(public view: ViewService, private router: Router, private tokenService: TokenService) {}
}

@Injectable({providedIn: 'root'})
export class AdminLoginGuard implements CanActivate {
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.tokenService.hasToken(true)) {
      return true;
    } else {
      this.view.alert('Please log in first.');
      this.router.navigate(['/admin/login']);
    }
  }
  constructor(public view: ViewService, private router: Router, private tokenService: TokenService) {}
}

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },

  { path: 'home', component: UserHomeComponent, canActivate: [UserLoginGuard] },
  { path: 'favorite', component: UserHomeComponent, canActivate: [UserLoginGuard] },
  { path: 'all', component: UserHomeComponent, canActivate: [UserLoginGuard] },
  { path: 'untagged', component: UserHomeComponent, canActivate: [UserLoginGuard] },
  { path: 'type/:id', component: UserHomeComponent, canActivate: [UserLoginGuard] },
  { path: 'tag/:id', component: UserHomeComponent, canActivate: [UserLoginGuard] },
  { path: 'list/:id', component: UserHomeComponent, canActivate: [UserLoginGuard] },

  { path: 'node/new', component: NodeEditComponent, canActivate: [UserLoginGuard] },
  { path: 'node/:id/edit', component: NodeEditComponent, canActivate: [UserLoginGuard] },

  { path: 'outside', component: OutsideComponent, canActivate: [UserLoginGuard] },
  { path: 'save', component: SaveComponent, canActivate: [UserLoginGuard] },

  { path: 'admin', redirectTo: 'admin/home', pathMatch: 'full' },
  { path: 'admin/login', component: LoginComponent },
  { path: 'admin/home', component: AdminHomeComponent, canActivate: [AdminLoginGuard] },
  { path: 'admin/user/new', component: UserEditComponent, canActivate: [AdminLoginGuard] },
  { path: 'admin/user/:id/edit', component: UserEditComponent, canActivate: [AdminLoginGuard] },
  { path: '**', redirectTo: 'home', pathMatch: 'full' },
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forRoot(routes)]
})
export class AppRoutingModule { }
