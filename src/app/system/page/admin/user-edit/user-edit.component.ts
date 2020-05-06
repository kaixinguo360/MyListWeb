import {Component, OnInit} from '@angular/core';
import {ViewService} from '../../../service/util/view.service';
import {User, UserService} from '../../../service/user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, Validators} from '@angular/forms';
import {TokenService} from '../../../service/token.service';
import {catchError, tap} from 'rxjs/operators';
import {MatSnackBar} from '@angular/material';
import {of} from 'rxjs';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {

  user: User = null;
  data = this.fb.group({
    id: null,
    name: this.fb.control(null, Validators.required),
    pass: this.fb.control(null, Validators.required),
    email: this.fb.control(null, Validators.email),
    status: this.fb.control('activated', Validators.required),
  });

  public submit() {
    const user: User = this.data.getRawValue();
    if (this.user == null || user.pass !== this.user.pass) {
      user.pass = TokenService.password(user.pass);
    }
    (user.id ?
      this.userService.update(user) :
      this.userService.add(user)
    ).pipe(
      tap(() => this.router.navigate(['/admin/home'])),
      catchError(err => {
        this.snackBar.open('An error occurred.', 'Close');
        return of(err);
      })
    ).subscribe();
  }

  constructor(
    public view: ViewService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(map => {
      const id = Number(map.get('id'));
      if (id) {
        this.view.init({title: 'User Edit'}, true);
        this.userService.get(id).subscribe(user => {
          this.user = user;
          this.data.setValue(user);
        });
      } else {
        this.view.init({title: 'New User'}, true);
      }
    });
  }

}
