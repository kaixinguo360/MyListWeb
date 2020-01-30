import {Component, OnInit, ViewChild} from '@angular/core';
import {catchError, tap} from 'rxjs/operators';
import {Subscription, throwError} from 'rxjs';
import {ViewService} from '../../../service/util/view.service';
import {FilterComponent} from '../../../com/filter/filter.component';
import {Node} from '../../../service/node.service';
import {ListService} from '../../../service/list.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  nodes: Node[];
  error = false;
  sub: Subscription;
  @ViewChild('filter', { read: FilterComponent, static: true }) filter: FilterComponent;

  fetchData() {
    if (this.sub) { this.sub.unsubscribe(); }
    this.view.setLoading(true);
    this.nodes = [];
    this.error = false;
    this.sub = this.listService.getAll(this.filter.getFilter()).pipe(
      tap(nodes => {
        this.nodes = nodes;
        this.view.setLoading(false);
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
    this.view.init({title: 'List Page'});
    this.filter.onChange(() => this.fetchData());
    this.fetchData();
  }
}
