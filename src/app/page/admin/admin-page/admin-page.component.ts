import {Component, OnInit} from '@angular/core';
import {ViewService} from '../../../service/view.service';
import {User, UserService} from '../../../service/user.service';
import {tap} from 'rxjs/operators';

@Component({
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})
export class AdminPageComponent implements OnInit {

  users: User[] = [];
  columnsToDisplay: string[] = ['name', 'email', 'status', 'operation'];

  fetchUsers() {
    this.userService.getAll().pipe(
      tap(users => this.users = users)
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

  constructor(
    public view: ViewService,
    private userService: UserService,
  ) { }

  ngOnInit() {
    this.view.init({title: 'Admin Home'}, true);
    this.fetchUsers();
  }

}
