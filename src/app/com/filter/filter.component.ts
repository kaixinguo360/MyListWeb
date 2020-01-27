import {Component, OnInit} from '@angular/core';
import {Query, SearchService} from '../../service/node/search.service';
import {FormBuilder} from '@angular/forms';
import {catchError, tap} from 'rxjs/operators';
import {of, Subject, Subscription} from 'rxjs';
import {ViewService} from '../../service/view.service';
import {Node} from '../../service/node/node';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {

  typeList: string[] = ['node', 'list', 'text', 'image', 'music', 'video', 'tag'];
  permissionList: string[] = [
    'private', 'protect', 'public', 'shared', 'self',
    'others_protect', 'others_public', 'others_shared',
    'editable', 'available'];
  data = this.fb.group({
    nsfw: false,
    like: false,
    hide: false,
    permission: 'self',
    types: this.fb.control([])
  });
  sub: Subscription;
  public subject = new Subject<Node[]>();

  public getQuery(): Query {
    const value = this.data.value;
    const query: Query = {
      nsfw: value.nsfw ? null : false,
      like: value.like ? true : null,
      hide: value.hide ? null : false,
      permission: value.permission,
      conditions: [],
      sorts: [],
      andTags: [],
      orTags: [],
      notTags: []
    };
    if (value.types.length < this.typeList.length && value.types.length > 0) {
      query.conditions.push({
        column: 'node_type',
        oper: 'in',
        value: '(\'' + value.types.join('\',\'') + '\')',
      });
    }
    return query;
  }

  public search() {
    if (this.sub) { this.sub.unsubscribe(); }
    this.viewService.loading = true;
    this.sub = this.searchService.search(this.getQuery()).pipe(
      tap(nodes => {
        this.subject.next(nodes);
        this.viewService.loading = false;
      }),
      catchError(err => {
        this.subject.error(err);
        return of(err);
      })
    ).subscribe();
  }

  constructor(
    private fb: FormBuilder,
    private searchService: SearchService,
    private viewService: ViewService,
  ) { }

  ngOnInit(): void {
  }
}
