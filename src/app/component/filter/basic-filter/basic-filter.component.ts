import {Component, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {Subject} from 'rxjs';
import {PreferenceService} from '../../../service/util/preference.service';
import {Filter} from '../../../service/util/filter';

@Component({
  selector: 'app-basic-filter',
  templateUrl: './basic-filter.component.html',
  styleUrls: ['./basic-filter.component.css']
})
export class BasicFilterComponent implements OnInit {

  data = this.fb.group({
    nsfw: false,
    like: false,
    hide: false,
    permission: 'self',
    types: this.fb.control([])
  });
  types: string[] = ['node', 'list', 'text', 'image', 'music', 'video', 'tag'];
  permissions: string[] = [
    'private', 'protect', 'public', 'shared', 'self',
    'others_protect', 'others_public', 'others_shared',
    'editable', 'available'];

  open = false;
  modified = false;

  private defaultData = JSON.stringify(this.data.value);
  private changed = false;
  private onChangeSubject = new Subject<void>();

  changeTypes() {
    this.data.patchValue({
      types: (this.data.value.types.length === this.types.length) ? [] : this.types
    });
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
      case 'available': this.data.patchValue({permission: 'others_shared'}); break;
      case 'self': this.data.patchValue({permission: 'available'}); break;
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
      this.preferenceService.set('saved_filter', json); // Save Filter
    }
  }

  public getFilter(): Filter {
    const value = this.data.value;
    const filter: Filter = {
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
    if (value.types.length < this.types.length && value.types.length > 0) {
      filter.conditions.push({
        column: 'node_type',
        oper: 'in',
        value: '(\'' + value.types.join('\',\'') + '\')',
      });
    }
    return filter;
  }
  public onChange(next?: (value: void) => void, error?: (error: any) => void, complete?: () => void) {
    this.onChangeSubject.subscribe(next, error, complete);
  }

  constructor(
    private fb: FormBuilder,
    private preferenceService: PreferenceService,
  ) {
    const saved = this.preferenceService.get('saved_filter');
    if (saved) {
      this.modified = (saved !== this.defaultData);
      this.data.setValue(JSON.parse(saved));
    }
  }

  ngOnInit(): void {
    this.data.statusChanges.subscribe(() => this.changed = true);
  }
}
