import {Component, OnInit} from '@angular/core';
import {ViewService} from '../../../service/util/view.service';
import {User, UserService} from '../../../service/user.service';
import {TokenService} from '../../../service/token.service';
import {Router} from '@angular/router';
import {catchError, tap} from 'rxjs/operators';
import {HttpErrorResponse} from '@angular/common/http';
import {of} from 'rxjs';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css']
})
export class AdminHomeComponent implements OnInit {

  users: User[] = [];
  columnsToDisplay: string[] = ['name', 'email', 'status', 'operation'];

  fetchUsers() {
    this.userService.getAll().pipe(
      tap(users => this.users = users),
      catchError(err => {
        if (err instanceof HttpErrorResponse && err.status === 401) {
          this.snackBar.open('The token has expired, please log in again.', 'Close');
          this.tokenService.removeToken(true);
          this.router.navigate(['/admin/login']);
        }
        return of(err);
      })
    ).subscribe();
  }
  deleteUser(user: User) {
    if (!confirm(`Delete user '${user.name}'?`)) { return; }
    if (prompt(`Please type '${user.name}' to confirm.`) !== user.name) {
      alert('Confirm failed, canceled.');
      return;
    }
    this.userService.remove(user.id).subscribe(
      () => this.fetchUsers()
    );
  }
  logout() {
    this.tokenService.invalidateToken(true).subscribe(() => this.router.navigate(['/admin/login']));
  }

  constructor(
    private viewService: ViewService,
    private userService: UserService,
    private tokenService: TokenService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {
    this.viewService.init('Admin Home');
  }

  ngOnInit() {
    this.fetchUsers();
  }

}
