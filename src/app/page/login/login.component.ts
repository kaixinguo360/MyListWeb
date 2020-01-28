import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router, UrlSegment} from '@angular/router';
import {FormBuilder, Validators} from '@angular/forms';
import {HttpErrorResponse} from '@angular/common/http';

import {of} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';

import {TokenService} from '../../service/token.service';
import {ViewService} from '../../service/util/view.service';
import {Subscription} from 'rxjs/internal/Subscription';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  isAdmin: boolean;
  loginData = this.fb.group({
    name: [null, Validators.required],
    pass: [null, Validators.required]
  });
  sub: Subscription;

  login() {
    const data = this.loginData.getRawValue();
    if (this.sub) { this.sub.unsubscribe(); }
    this.sub = this.authService.generateToken(data.name, data.pass, this.isAdmin).pipe(
      tap(() => {
        this.router.navigate([this.isAdmin ? 'admin/home' : 'home']);
      }),
      catchError(err => {
        if (err instanceof HttpErrorResponse && err.status === 401) {
          alert('用户名或密码错误!');
        } else {
          alert('未知错误!');
        }
        return of(err);
      })
    ).subscribe();
  }

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: TokenService,
    private viewService: ViewService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.url.subscribe((urls: UrlSegment[]) => {
      const url = urls.join('/');
      switch (url) {
        case 'admin/login': {
          this.viewService.init('Admin Login', [], true);
          this.isAdmin = true;
          break;
        }
        case 'login':
        default: {
          this.viewService.init('User Login', []);
          this.isAdmin = false;
          break;
        }
      }
    });
  }
}
