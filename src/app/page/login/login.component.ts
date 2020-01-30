import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router, UrlSegment} from '@angular/router';
import {FormBuilder, Validators} from '@angular/forms';

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
    if (this.sub) { this.sub.unsubscribe(); }
    const data = this.loginData.getRawValue();

    this.sub = (this.view.admin ?
      this.authService.generateAdminToken(data.pass) :
      this.authService.generateToken(data.name, data.pass)
    ).pipe(
      tap(() => this.router.navigate([this.isAdmin ? 'admin/home' : 'home'])),
      catchError(err => { alert('未知错误!'); return of(err); })
    ).subscribe();
  }

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: TokenService,
    public view: ViewService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.url.subscribe((urls: UrlSegment[]) => {
      const url = urls.join('/');
      switch (url) {
        case 'admin/login': {
          this.view.init({title: 'Admin Login', background: '#00000033'}, true);
          this.isAdmin = true;
          break;
        }
        case 'login':
        default: {
          this.view.init({title: 'User Login', background: '#00000033'});
          this.isAdmin = false;
          break;
        }
      }
    });
  }
}
