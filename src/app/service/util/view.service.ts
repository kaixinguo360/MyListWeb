import {ChangeDetectorRef, Injectable} from '@angular/core';
import {TokenService} from '../token.service';
import {Router} from '@angular/router';
import {AppConfig} from '../../../environments/app-config';
import {User} from '../user.service';
import {MatSnackBar} from '@angular/material';
import {MatSnackBarConfig} from '@angular/material/snack-bar/typings/snack-bar-config';
import {Title} from '@angular/platform-browser';

export interface ViewConfig {
  title: string;
}

@Injectable({
  providedIn: 'root'
})
export class ViewService {

  public static back;
  public static reload;
  public static logout;
  public static stopScroll;
  public static alert;

  public user: User;
  public admin = false;
  public loading = false;
  public config: ViewConfig = {title: ''};

  public isMobile = window.innerWidth < AppConfig.mobileWidth;

  public tokenService: TokenService; // @Autowired
  public router: Router; // @Autowired
  public cdRef: ChangeDetectorRef; // @Autowired
  public matSnackBar: MatSnackBar; // @Autowired
  public titleService: Title; // @Autowired

  public init(config: ViewConfig, admin = false) {
    this.loading = false;
    this.config = config;
    this.admin = admin;
    this.onChange();
  }
  public setLoading(loading: boolean) {
    this.loading = loading;
    this.onChange();
  }
  private onChange() {
    this.titleService.setTitle('MyList' + (this.config.title ? ` - ${this.config.title}` : ''));
    this.cdRef.detectChanges();
  }

  public back() {
    window.stop();
    window.history.back();
  }
  public reload() {
    location.reload();
  }
  public logout() {
    this.tokenService.invalidateToken()
      .subscribe(() => {
        this.router.navigate([this.admin ? '/admin/login' : '/login']);
        location.reload();
      });
  }
  public stopScroll(isFixed) {
    document.body.style.overflow = isFixed ? 'hidden' : '';
  }
  public alert(message: string, action: string = 'Close', config: MatSnackBarConfig = {duration: 2000}) {
    this.matSnackBar.open(message, action, config);
  }

  constructor() {
    ViewService.back = this.back;
    ViewService.reload = this.reload;
    ViewService.logout = this.logout;
    ViewService.stopScroll = this.stopScroll;
    ViewService.alert = this.alert;
  }
}
