import {Injectable} from '@angular/core';
import {TokenService} from '../token.service';
import {Router} from '@angular/router';
import {AppConfig} from '../../../environments/app-config';
import {User} from '../user.service';

export interface ViewConfig {
  title: string;
  background?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ViewService {

  public user: User;
  public admin = false;
  public loading = false;
  public changed = false;
  public config: ViewConfig = {title: ''};

  public tokenService: TokenService;
  public router: Router;

  public isMobile = window.innerWidth < AppConfig.mobileWidth;

  public init(config: ViewConfig, admin = false) {
    this.changed = true;
    this.loading = false;
    this.config = config;
    this.admin = admin;
  }
  public setLoading(loading: boolean) {
    this.changed = true;
    this.loading = loading;
  }

  public back() {
    window.stop();
    window.history.back();
  }
  public refresh() { location.reload(); }
  public logout() {
    this.tokenService.invalidateToken()
      .subscribe(() => this.router.navigate([this.admin ? '/admin/login' : '/login']));
  }

  public stopBodyScroll(isFixed) {
    document.body.style.overflow = isFixed ? 'hidden' : '';
  }
}
