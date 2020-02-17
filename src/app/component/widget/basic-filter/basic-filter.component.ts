import {Component, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {Subject, Subscription} from 'rxjs';
import {Preference} from '../../../service/util/preference.service';
import {Filter} from '../../../service/util/filter';
import {TypeService} from '../../../service/util/type.service';

@Component({
  selector: 'app-basic-filter',
  templateUrl: './basic-filter.component.html',
  styleUrls: ['./basic-filter.component.css']
})
export class BasicFilterComponent implements OnInit {

  data = this.fb.group({
    cascade: false,
    nsfw: false,
    like: false,
    hide: false,
    collection: 'implode',
    permission: 'self',
    types: this.fb.control([])
  });
  types: string[] = TypeService.typeInfos.map(info => info.id);
  permissions: string[] = [
    'private', 'protect', 'public', 'shared', 'self',
    'others_protect', 'others_public', 'others_shared',
    'editable', 'available'];

  open = false;
  modified = false;

  private defaultData = JSON.stringify(this.data.value);
  private changed = false;
  private onChangeSubject = new Subject<void>();

  changePart() {
    switch (this.data.value.collection) {
      case 'implode': this.data.patchValue({collection: 'explode'}); break;
      case 'explode': this.data.patchValue({collection: 'all'}); break;
      default: this.data.patchValue({collection: 'implode'}); break;
    }
  }
  changeOptions() {
    const value = this.data.value;
    this.data.patchValue(
      (value.nsfw === true && value.like === false && value.hide === true) ?
        {nsfw: false, like: false, hide: false} :
        {nsfw: true, like: false, hide: true}
        );
  }
  changePermission() {
    switch (this.data.value.permission) {
      case 'self': this.data.patchValue({permission: 'available'}); break;
      case 'available': this.data.patchValue({permission: 'others_shared'}); break;
      default: this.data.patchValue({permission: 'self'}); break;
    }
  }
  reset() {
    this.data.setValue(JSON.parse(this.defaultData));
  }
  close() {
    this.open = !this.open;
    if (!this.open && this.changed) {
      this.changed = false;
      this.onChangeSubject.next();
      const json = JSON.stringify(this.data.value);
      this.modified = (json !== this.defaultData);
      this.preference.set('saved_filter', json); // Save Filter
    }
  }

  public getFilter(): Filter {
    const value = this.data.value;
    const filter: Filter = {
      cascade: !!value.cascade,
      types: value.types.length ? value.types : null,
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
    switch (value.collection) {
      case 'implode': filter.part = false; break;
      case 'explode': filter.collection = false; break;
      default: break;
    }
    return filter;
  }
  public onChange(next?: (value: void) => void, error?: (error: any) => void, complete?: () => void): Subscription {
    return this.onChangeSubject.subscribe(next, error, complete);
  }

  constructor(
    public preference: Preference,
    private typeService: TypeService,
    private fb: FormBuilder,
  ) {
    const saved = this.preference.get('saved_filter');
    if (saved) {
      this.modified = (saved !== this.defaultData);
      this.data.patchValue(JSON.parse(saved));
    }
  }

  ngOnInit(): void {
    this.data.statusChanges.subscribe(() => this.changed = true);
  }
}
