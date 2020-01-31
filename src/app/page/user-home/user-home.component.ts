import {Component, OnInit, ViewChild} from '@angular/core';
import {ViewService} from '../../service/util/view.service';
import {Node} from '../../service/node.service';
import {FilterComponent} from '../../com/filter/filter.component';
import {catchError, tap} from 'rxjs/operators';
import {Subscription, throwError} from 'rxjs';
import {ListService} from '../../service/list.service';

@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.css']
})
export class UserHomeComponent implements OnInit {

  nodes: Node[];
  error = false;
  sub: Subscription;
  @ViewChild('filter', { read: FilterComponent, static: true }) filter: FilterComponent;

  fetchData() {
    if (this.sub) { this.sub.unsubscribe(); }
    this.nodes = [];
    this.error = false;
    this.sub = this.listService.getAll(this.filter.getFilter()).pipe(
      tap(nodes => {
        this.nodes = nodes;
      }),
      catchError(err => {
        this.error = false;
        return throwError(err);
      })
    ).subscribe();
  }

  constructor(
    public view: ViewService,
    private listService: ListService,
  ) { }

  ngOnInit(): void {
    this.view.init({title: 'Home'});
    this.filter.onChange(() => this.fetchData());
    this.fetchData();
  }
}
