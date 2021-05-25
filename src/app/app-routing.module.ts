import {Injectable, NgModule} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterModule, RouterStateSnapshot, Routes} from '@angular/router';

import {LoginPageComponent} from './page/user/login-page/login-page.component';
import {AdminPageComponent} from './page/admin/admin-page/admin-page.component';
import {MainPageComponent} from './page/user/main-page/main-page.component';
import {UserEditPageComponent} from './page/admin/user-edit-page/user-edit-page.component';
import {EditPageComponent} from './page/user/edit-page/edit-page.component';
import {OutsidePageComponent} from './page/user/outside-page/outside-page.component';
import {TokenService} from './service/token.service';
import {ViewService} from './service/view.service';
import {SavePageComponent} from './page/user/save-page/save-page.component';

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
  { path: 'login', component: LoginPageComponent },

  { path: 'home', component: MainPageComponent, canActivate: [UserLoginGuard] },
  { path: 'favorite', component: MainPageComponent, canActivate: [UserLoginGuard] },
  { path: 'all', component: MainPageComponent, canActivate: [UserLoginGuard] },
  { path: 'untagged', component: MainPageComponent, canActivate: [UserLoginGuard] },
  { path: 'type/:id', component: MainPageComponent, canActivate: [UserLoginGuard] },
  { path: 'tag/:id', component: MainPageComponent, canActivate: [UserLoginGuard] },
  { path: 'list/:id', component: MainPageComponent, canActivate: [UserLoginGuard] },
  { path: 'dlist/:id', component: MainPageComponent, canActivate: [UserLoginGuard] },

  { path: 'node/new', component: EditPageComponent, canActivate: [UserLoginGuard] },
  { path: 'node/:id/edit', component: EditPageComponent, canActivate: [UserLoginGuard] },

  { path: 'outside', component: OutsidePageComponent, canActivate: [UserLoginGuard] },
  { path: 'save', component: SavePageComponent, canActivate: [UserLoginGuard] },

  { path: 'admin', redirectTo: 'admin/home', pathMatch: 'full' },
  { path: 'admin/login', component: LoginPageComponent },
  { path: 'admin/home', component: AdminPageComponent, canActivate: [AdminLoginGuard] },
  { path: 'admin/user/new', component: UserEditPageComponent, canActivate: [AdminLoginGuard] },
  { path: 'admin/user/:id/edit', component: UserEditPageComponent, canActivate: [AdminLoginGuard] },
  { path: '**', redirectTo: 'home', pathMatch: 'full' },
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forRoot(routes)]
})
export class AppRoutingModule { }
