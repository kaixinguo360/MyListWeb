import {Component, OnInit, ViewChild} from '@angular/core';
import {FilterSelectorComponent} from '../../component/filter-selector/filter-selector.component';
import {ViewService} from '../../service/util/view.service';
import {catchError, tap} from 'rxjs/operators';
import {Subscription, throwError} from 'rxjs';
import {MasonryComponent} from '../../component/masonry/masonry.component';
import {NodeService} from '../../service/node.service';
import {Node} from '../../service/util/node';

@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.css']
})
export class UserHomeComponent implements OnInit {

  error = false;
  sub: Subscription;
  @ViewChild('filter', { read: FilterSelectorComponent, static: true }) filter: FilterSelectorComponent;
  @ViewChild('masonry', { read: MasonryComponent, static: true }) masonry: MasonryComponent;

  fetchData() {
    if (this.sub) { this.sub.unsubscribe(); }
    this.error = false;
    this.sub = this.nodeService.getAll(this.filter.getFilter()).pipe(
      tap(nodes => this.masonry.setNodes(nodes)),
      catchError(err => {
        this.error = false;
        return throwError(err);
      })
    ).subscribe();
  }
  tag() {
    this.getNodes(nodes => {});
  }
  star() {
    this.getNodes(nodes => {});
  }
  delete() {
    this.getNodes(nodes => {});
  }
  private getNodes(handler: (nodes: Node[]) => void) {
    const nodes = this.masonry.getSelectedItems();
    if (nodes.length) {
      this.masonry.enableSelectMode(false);
      handler(nodes);
    } else {
      this.view.alert('Please select at least one item.');
    }
  }

  constructor(
    public view: ViewService,
    private nodeService: NodeService,
  ) { }

  ngOnInit(): void {
    this.view.init({title: 'Home'});
    this.filter.onChange(() => this.fetchData());
    this.fetchData();
  }
}
