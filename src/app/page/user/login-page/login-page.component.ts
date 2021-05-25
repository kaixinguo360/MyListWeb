import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router, UrlSegment} from '@angular/router';
import {FormBuilder, Validators} from '@angular/forms';

import {of} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';

import {TokenService} from '../../../service/token.service';
import {ViewService} from '../../../service/view.service';
import {Subscription} from 'rxjs/internal/Subscription';

@Component({
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {

  loginData = this.fb.group({
    name: [null, Validators.required],
    pass: [null, Validators.required]
  });
  sub: Subscription;

  login() {
    if (this.sub) { this.sub.unsubscribe(); }
    const data = this.loginData.getRawValue();

    this.sub = (this.view.admin ?
      this.tokenService.generateAdminToken(data.pass) :
      this.tokenService.generateToken(data.name, data.pass)
    ).pipe(
      tap(() => this.router.navigate([this.view.admin ? '/admin/home' : '/home'])),
      catchError(err => of(err))
    ).subscribe();
  }

  constructor(
    public view: ViewService,
    private router: Router,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private tokenService: TokenService,
  ) { }

  ngOnInit() {
    this.route.url.subscribe((urls: UrlSegment[]) => {
      const url = urls.join('/');
      switch (url) {
        case 'admin/login': {
          this.view.init({title: 'Admin Login'}, true);
          break;
        }
        case 'login':
        default: {
          this.view.init({title: 'User Login'});
          break;
        }
      }
      if (this.tokenService.hasToken()) {
        this.router.navigate([this.view.admin ? '/admin/home' : '/home']);
      }
    });
  }
}
