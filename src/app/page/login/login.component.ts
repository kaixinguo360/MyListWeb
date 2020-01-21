import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, Validators} from '@angular/forms';
import {HttpErrorResponse} from '@angular/common/http';

import {of} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';

import {AuthService} from '../../service/auth.service';
import {ViewService} from '../../service/view.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginData = this.fb.group({
    name: [null, Validators.required],
    pass: [null, Validators.required]
  });

  login() {
    const data = this.loginData.getRawValue();
    this.authService.login(data.name, data.pass, false).pipe(
      tap(() => {
        this.router.navigate(['list']);
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
    private authService: AuthService,
    private viewService: ViewService,
  ) {
    this.viewService.hasBackButton = false;
    this.viewService.title = 'Login';
  }

  ngOnInit() {
    if (this.authService.isLogin()) {
      this.router.navigate([ 'list' ]);
    }
  }
}
