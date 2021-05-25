import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ExtraEdit} from '../../../component/node-edit/extra-edit/extra-edit';
import {ViewService} from '../../../service/view.service';
import {SearchFilterComponent} from '../../../component/widget/search-filter/search-filter.component';
import {Subscription} from 'rxjs';
import {ExtraData} from '../../../service/node.service';

@Component({
  selector: 'app-d-list-edit',
  templateUrl: './d-list-edit.component.html',
  styleUrls: ['./d-list-edit.component.css']
})
export class DListEditComponent implements ExtraEdit, OnInit, OnDestroy {

  @ViewChild('searchFilter', { read: SearchFilterComponent, static: true }) searchFilter: SearchFilterComponent;
  preview: string;
  otherSubs: Subscription[] = [];

  public getExtraData() {
    return {
      nodeType: 'dlist',
      filter: JSON.stringify(this.searchFilter.getFilter()),
      config: this.searchFilter.getConfig(),
    };
  }
  public setExtraData(extraData: ExtraData) {
    this.searchFilter.setConfig((extraData as any).config);
  }

  updatePreview() {
    const filter = this.searchFilter.getFilter();
    this.preview = JSON.stringify(filter, null, '\t');
  }
  ngOnInit(): void {
    this.updatePreview();
    this.otherSubs.push(this.searchFilter.onChange(() => this.updatePreview()));
  }
  ngOnDestroy(): void {
    this.otherSubs.forEach(sub => sub.unsubscribe());
  }

  constructor(
    public view: ViewService,
  ) {}

}
