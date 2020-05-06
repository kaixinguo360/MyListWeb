import {Injectable, NgModule} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterModule, RouterStateSnapshot, Routes} from '@angular/router';

import {LoginComponent} from './system/page/login/login.component';
import {AdminHomeComponent} from './system/page/admin/home/admin-home.component';
import {UserHomeComponent} from './system/page/user-home/user-home.component';
import {UserEditComponent} from './system/page/admin/user-edit/user-edit.component';
import {TokenService} from './system/service/token.service';
import {ViewService} from './system/service/util/view.service';

import {ImageSearchComponent} from './module/image/image-search/image-search.component';
import {ImageModule} from './module/image/image.module';

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

  { path: 'image', component: ImageSearchComponent, canActivate: [UserLoginGuard] },

  { path: 'admin', redirectTo: 'admin/home', pathMatch: 'full' },
  { path: 'admin/login', component: LoginComponent },
  { path: 'admin/home', component: AdminHomeComponent, canActivate: [AdminLoginGuard] },
  { path: 'admin/user/new', component: UserEditComponent, canActivate: [AdminLoginGuard] },
  { path: 'admin/user/:id/edit', component: UserEditComponent, canActivate: [AdminLoginGuard] },
  { path: '**', redirectTo: 'home', pathMatch: 'full' },
];

@NgModule({
  exports: [RouterModule],
  imports: [
    RouterModule.forRoot(routes),
    ImageModule,
  ]
})
export class AppRoutingModule { }
