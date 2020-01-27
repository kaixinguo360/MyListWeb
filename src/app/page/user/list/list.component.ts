import {Component, OnInit, ViewChild} from '@angular/core';
import {catchError, tap} from 'rxjs/operators';
import {of} from 'rxjs';
import {ViewService} from '../../../service/util/view.service';
import {FilterComponent} from '../../../com/filter/filter.component';
import {Node} from '../../../service/node.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  nodes: Node[];
  error = false;
  @ViewChild('filter', { read: FilterComponent, static: true }) filter: FilterComponent;
  refresh() { location.reload(); }

  constructor(
    private viewService: ViewService,
  ) {
    this.viewService.init('List Page');
  }

  ngOnInit(): void {
    this.filter.subject.pipe(
      tap(nodes => {
        this.nodes = nodes;
        this.error = false;
      }),
      catchError(err => {
        this.error = true;
        return of(err);
      })
    ).subscribe();
    this.filter.search();
  }
}
