import {Component, OnInit} from '@angular/core';
import {Subject, Subscription} from 'rxjs';
import {tap} from 'rxjs/operators';
import {Node} from '../../../service/util/node';
import {NodeService} from '../../../service/node.service';
import {Keyword} from './keyword-input/keyword-input.component';
import {Preference} from '../../../service/util/preference.service';
import {Condition, Tag} from '../../../service/util/filter';

class KeyWords {
  or: Keyword[];
  and: Keyword[];
  not: Keyword[];
  noTag: boolean;
  advanced: boolean;
}

@Component({
  selector: 'app-search-filter',
  templateUrl: './search-filter.component.html',
  styleUrls: ['./search-filter.component.css']
})
export class SearchFilterComponent implements OnInit {

  allTags: Node[] = [];

  orKeyWords: Keyword[] = [];
  andKeyWords: Keyword[] = [];
  notKeyWords: Keyword[] = [];

  open = false;
  modified = false;
  noTag = false;
  advanced = false;
  changed = false;

  private defaultData = JSON.stringify({or: [], and: [], not: [], noTag: false, advanced: false});
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
    this.changed = true;
    this.noTag = false;
    this.advanced = false;
    this.orKeyWords.length = 0;
    this.andKeyWords.length = 0;
    this.notKeyWords.length = 0;
  }
  close() {
    this.open = false;
    if (!this.open && this.changed) {
      this.changed = false;
      this.onChangeSubject.next();
      const json = JSON.stringify({
        or: this.orKeyWords,
        and: this.andKeyWords,
        not: this.notKeyWords,
        noTag: this.noTag,
        advanced : this.advanced,
      });
      this.modified = (json !== this.defaultData);
      this.preference.set('saved_keywords', json); // Save Tags
    }
  }

  public getTags(): { or: Tag[], and: Tag[], not: Tag[] } {
    return this.noTag ? {
      or: [],
      and: [],
      not: this.allTags.map(i => ({id: i.mainData.id})),
    } : {
      or: SearchFilterComponent.toTags(this.orKeyWords.filter(t => !t.isNew)),
      and: SearchFilterComponent.toTags(this.andKeyWords.filter(t => !t.isNew)),
      not: SearchFilterComponent.toTags(this.notKeyWords.filter(t => !t.isNew)),
    };
  }
  public getConditions(): Condition[] {
    let conditions = [];

    let or = this.orKeyWords.filter(t => t.isNew).map(t => t.title);
    if (or.length) {
      or = or.map(t => t.replace('\\', '\\\\'));
      conditions.push({
        column: `CONCAT(COALESCE(node_title, ''), COALESCE(node_description, ''), COALESCE(node_comment, ''), COALESCE(node_source, ''))`,
        oper: 'REGEXP',
        value: `'${or.reduce((a, b) => a + '|' + b)}'`,
      });
    }

    const and = this.andKeyWords.filter(t => t.isNew).map(t => ({
      column: `CONCAT(COALESCE(node_title, ''), COALESCE(node_description, ''), COALESCE(node_comment, ''), COALESCE(node_source, ''))`,
      oper: 'REGEXP',
      value: `'${t.title}'`,
    }));
    if (and && and.length) {
      conditions = conditions.concat(and);
    }

    let not = this.notKeyWords.filter(t => t.isNew).map(t => t.title);
    if (not.length) {
      not = not.map(t => t.replace('\\', '\\\\'));
      conditions.push({
        column: `CONCAT(COALESCE(node_title, ''), COALESCE(node_description, ''), COALESCE(node_comment, ''), COALESCE(node_source, ''))`,
        oper: 'NOT REGEXP',
        value: `'${not.reduce((a, b) => a + '|' + b)}'`,
      });
    }

    return conditions;
  }
  public onChange(next?: (value: void) => void, error?: (error: any) => void, complete?: () => void): Subscription {
    return this.onChangeSubject.subscribe(next, error, complete);
  }

  constructor(
    public preference: Preference,
    private nodeService: NodeService,
  ) {
    const savedKeywords = this.preference.get('saved_keywords');
    if (savedKeywords) {
      this.modified = (savedKeywords !== this.defaultData);
      const chipItems: KeyWords = JSON.parse(savedKeywords);
      this.orKeyWords = chipItems.or;
      this.andKeyWords = chipItems.and;
      this.notKeyWords = chipItems.not;
      this.noTag = chipItems.noTag;
      this.advanced = chipItems.advanced;
    }
  }

  ngOnInit(): void {
    this.nodeService.getAllByType('tag', {permission: 'available'}).pipe(
      tap(tags => {
        this.allTags = tags;
        if (this.noTag) { this.onChangeSubject.next(); }
      })
    ).subscribe();
  }

}
