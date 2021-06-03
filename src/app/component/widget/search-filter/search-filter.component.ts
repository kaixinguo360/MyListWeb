import {Component, Input, OnInit} from '@angular/core';
import {Subject, Subscription} from 'rxjs';
import {tap} from 'rxjs/operators';
import {Filter, Node, NodeService, Tag} from '../../../service/node.service';
import {Keyword} from './keyword-input/keyword-input.component';
import {Preference} from '../../../service/preference.service';
import {TypeService} from '../../../service/type.service';
import {FormBuilder} from '@angular/forms';
import {Router} from '@angular/router';

class FilterConfig {
  orKeywords: Keyword[];
  andKeywords: Keyword[];
  notKeywords: Keyword[];
  isOnlyUntagged: boolean;
  isAdvanced: boolean;
  filter: any;
}

@Component({
  selector: 'app-search-filter',
  templateUrl: './search-filter.component.html',
  styleUrls: ['./search-filter.component.css']
})
export class SearchFilterComponent implements OnInit {

  allTags: Node[] = [];
  @Input() autoSave = true;

  // Status
  isOpen = false;
  isModified = false;
  isChanged = false;

  // Current Config
  orKeywords: Keyword[] = [];
  andKeywords: Keyword[] = [];
  notKeywords: Keyword[] = [];
  isOnlyUntagged = false;
  isAdvanced = false;
  filter = this.fb.group({
    cascade: false,
    nsfw: false,
    like: false,
    hide: false,
    collection: 'implode',
    permission: 'self',
    types: this.fb.control([])
  });

  // Default Config
  defaultConfig = {
    orKeywords: [], andKeywords: [], notKeywords: [],
    isOnlyUntagged: false, isAdvanced: false,
    filter: this.filter.value,
  };
  defaultJSON = JSON.stringify(this.defaultConfig);
  types: string[] = TypeService.typeInfos.map(info => info.id);
  permissions: string[] = [
    'private', 'protect', 'public', 'shared', 'self',
    'others_protect', 'others_public', 'others_shared',
    'editable', 'available'];

  // Subject & Utils
  private onChangeSubject = new Subject<void>();
  private static toTags(chipItems: Keyword[]): Tag[] {
    return chipItems.map(i => ({
      strict: false,
      value: i.title,
      id: i.isNew ? undefined : i.node.mainData.id,
      type: i.node.mainData.type,
    }));
  }

  reset() {
    this.isChanged = true;
    this.isOnlyUntagged = this.defaultConfig.isOnlyUntagged;
    this.isAdvanced = this.defaultConfig.isAdvanced;
    this.orKeywords.length = 0;
    this.andKeywords.length = 0;
    this.notKeywords.length = 0;
    this.filter.setValue(this.defaultConfig.filter);
  }
  search() {
    this.isOpen = false;
    this.isChanged = false;
    this.saveConfig();
    this.router.navigate(['/all']);
    this.onChangeSubject.next();
  }
  close(changed?: boolean) {
    this.isOpen = false;
    this.isChanged = (changed === undefined) ? this.isChanged : changed;

    if (!this.isOpen && this.isChanged) {
      this.isChanged = false;
      this.onChangeSubject.next();
      this.saveConfig();
    }
  }

  changePart() {
    switch (this.filter.value.collection) {
      case 'implode': this.filter.patchValue({collection: 'explode'}); break;
      case 'explode': this.filter.patchValue({collection: 'all'}); break;
      default: this.filter.patchValue({collection: 'implode'}); break;
    }
  }
  changeOptions() {
    const value = this.filter.value;
    this.filter.patchValue(
      (value.nsfw === true && value.like === false && value.hide === true) ?
        {nsfw: false, like: false, hide: false} :
        {nsfw: true, like: false, hide: true}
    );
  }
  changePermission() {
    switch (this.filter.value.permission) {
      case 'self': this.filter.patchValue({permission: 'available'}); break;
      case 'available': this.filter.patchValue({permission: 'others_shared'}); break;
      default: this.filter.patchValue({permission: 'self'}); break;
    }
  }

  public getConfig(): string {
    const currentConfig: FilterConfig = {
      orKeywords: this.orKeywords,
      andKeywords: this.andKeywords,
      notKeywords: this.notKeywords,
      isOnlyUntagged: this.isOnlyUntagged,
      isAdvanced : this.isAdvanced,
      filter: this.filter.value,
    };
    return JSON.stringify(currentConfig);
  }
  public setConfig(json: string) {
    if (json) {
      this.isModified = (json !== this.defaultJSON);
      const savedConfig: FilterConfig = JSON.parse(json);
      this.filter.patchValue(savedConfig.filter);
      this.orKeywords = savedConfig.orKeywords;
      this.andKeywords = savedConfig.andKeywords;
      this.notKeywords = savedConfig.notKeywords;
      this.isOnlyUntagged = savedConfig.isOnlyUntagged;
      this.isAdvanced = savedConfig.isAdvanced;
    }
  }
  private saveConfig() {
    const json = this.getConfig();
    this.isModified = (json !== this.defaultJSON);
    if (this.autoSave) { this.preference.set('search-filter@savedData', json); }
  }
  private loadConfig() {
    const json = this.preference.get('search-filter@savedData');
    this.setConfig(json);
  }
  private getBasicFilter(): Filter {
    const value = this.filter.value;
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

  public getFilter(): Filter {
    const filter = this.getBasicFilter();

    if (this.isOnlyUntagged) {
      filter.notTags = this.allTags.map(i => ({id: i.mainData.id}));
    } else {
      filter.orTags = SearchFilterComponent.toTags(this.orKeywords.filter(t => !t.isNew));
      filter.andTags = SearchFilterComponent.toTags(this.andKeywords.filter(t => !t.isNew));
      filter.notTags = SearchFilterComponent.toTags(this.notKeywords.filter(t => !t.isNew));
    }

    filter.orKeywords = this.orKeywords.filter(t => t.isNew).map(t => t.title);
    filter.andKeywords = this.andKeywords.filter(t => t.isNew).map(t => t.title);
    filter.notKeywords = this.notKeywords.filter(t => t.isNew).map(t => t.title);

    return filter;
  }
  public onChange(next?: (value: void) => void, error?: (error: any) => void, complete?: () => void): Subscription {
    return this.onChangeSubject.subscribe(next, error, complete);
  }

  constructor(
    public preference: Preference,
    private nodeService: NodeService,
    private typeService: TypeService,
    private router: Router,
    private fb: FormBuilder,
  ) {
    this.loadConfig();
  }

  ngOnInit(): void {
    this.nodeService.getAllByType('tag', {
      permission: 'available',
      sorts: [{ property: 'node_title', direction: 'asc' }]
    }).pipe(
      tap(tags => {
        this.allTags = tags;
        if (this.isOnlyUntagged) { this.onChangeSubject.next(); }
      })
    ).subscribe();
    this.filter.statusChanges.subscribe(() => this.isChanged = true);
  }

}
