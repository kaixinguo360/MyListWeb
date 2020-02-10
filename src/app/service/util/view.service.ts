import {ChangeDetectorRef, Injectable} from '@angular/core';
import {TokenService} from '../token.service';
import {Router} from '@angular/router';
import {AppConfig} from '../../../environments/app-config';
import {User} from '../user.service';
import {MatSnackBar} from '@angular/material';
import {MatSnackBarConfig} from '@angular/material/snack-bar/typings/snack-bar-config';
import {Title} from '@angular/platform-browser';
import {Observable, Subject} from 'rxjs';

export interface ViewConfig {
  title: string;
}

@Injectable({
  providedIn: 'root'
})
export class ViewService {

  public static instance: ViewService;

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

  private notifySubjects = new Map<string, Subject<void>>();

  public init(config: ViewConfig, admin = false) {
    this.loading = false;
    this.config = config;
    this.admin = admin;
    this.changed();
  }
  public setLoading(loading: boolean) {
    this.loading = loading;
    this.changed();
  }
  private changed() {
    this.titleService.setTitle('MyList' + (this.config.title ? ` - ${this.config.title}` : ''));
    this.cdRef.detectChanges();
  }

  public notify(subject: string) {
    if (this.notifySubjects.has(subject)) { this.notifySubjects.get(subject).next(); }
  }
  public notification(subject: string): Observable<void> {
    if (this.notifySubjects.has(subject)) {
      return this.notifySubjects.get(subject);
    } else {
      const notifySubject = new Subject<void>();
      this.notifySubjects.set(subject, notifySubject);
      return notifySubject;
    }
  }

  public back() {
    window.stop();
    window.history.back();
  }
  public logout() {
    this.tokenService.invalidateToken()
      .subscribe(() => {
        location.href = this.admin ? '/admin/login' : '/login';
      });
  }
  public stopScroll(isFixed) {
    document.body.style.overflow = isFixed ? 'hidden' : '';
  }
  public alert(message: string, action: string = 'Close', config: MatSnackBarConfig = {duration: 2000}) {
    this.matSnackBar.open(message, action, config);
  }
  public detectChanges() {
    this.cdRef.detectChanges();
  }

  constructor() {
    ViewService.instance = this;
  }
}
