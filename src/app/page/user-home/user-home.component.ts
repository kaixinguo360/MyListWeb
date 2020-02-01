import {Component, OnInit, ViewChild} from '@angular/core';
import {ViewService} from '../../service/util/view.service';
import {FilterComponent} from '../../com/filter/filter.component';
import {catchError, tap} from 'rxjs/operators';
import {Subscription, throwError} from 'rxjs';
import {ListService} from '../../service/list.service';
import {MasonryComponent} from '../../com/masonry/masonry.component';

@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.css']
})
export class UserHomeComponent implements OnInit {

  error = false;
  sub: Subscription;
  @ViewChild('filter', { read: FilterComponent, static: true }) filter: FilterComponent;
  @ViewChild('masonry', { read: MasonryComponent, static: true }) masonry: MasonryComponent;

  fetchData() {
    if (this.sub) { this.sub.unsubscribe(); }
    this.error = false;
    this.sub = this.listService.getAll(this.filter.getFilter()).pipe(
      tap(nodes => this.masonry.setNodes(nodes)),
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
