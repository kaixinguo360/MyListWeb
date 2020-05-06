import {ChangeDetectorRef, Injectable} from '@angular/core';
import {TokenService} from '../token.service';
import {Router} from '@angular/router';
import {AppConfig} from '../../../../environments/app-config';
import {User} from '../user.service';
import {MatSnackBar} from '@angular/material';
import {MatSnackBarConfig} from '@angular/material/snack-bar/typings/snack-bar-config';
import {Title} from '@angular/platform-browser';
import {Observable, Subject} from 'rxjs';
import {MatSnackBarRef} from '@angular/material/snack-bar/typings/snack-bar-ref';
import {SimpleSnackBar} from '@angular/material/snack-bar/typings/simple-snack-bar';
import {Location} from '@angular/common';

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
  public location: Location; // @Autowired
  public cdRef: ChangeDetectorRef; // @Autowired
  public matSnackBar: MatSnackBar; // @Autowired
  public titleService: Title; // @Autowired

  private notifySubjects = new Map<string, Subject<any>>();

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
  public setTitle(title: string) {
    this.config.title = title;
    this.changed();
  }
  private changed() {
    this.titleService.setTitle('MyList' + (this.config.title ? ` - ${this.config.title}` : ''));
    this.cdRef.detectChanges();
  }

  public notify(subject: string, value: any = null) {
    if (this.notifySubjects.has(subject)) { this.notifySubjects.get(subject).next(value); }
  }
  public notification(subject: string): Observable<any> {
    if (this.notifySubjects.has(subject)) {
      return this.notifySubjects.get(subject);
    } else {
      const notifySubject = new Subject<any>();
      this.notifySubjects.set(subject, notifySubject);
      return notifySubject;
    }
  }

  public stop() {
    window.stop();
  }
  public back() {
    this.location.back();
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
  public alert(message: string, action: string = 'Close', config: MatSnackBarConfig = {duration: 2000}): MatSnackBarRef<SimpleSnackBar> {
    return this.matSnackBar.open(message, action, config);
  }
  public detectChanges() {
    this.cdRef.detectChanges();
  }

  constructor() {
    ViewService.instance = this;
  }
}
