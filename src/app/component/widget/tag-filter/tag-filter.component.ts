import {Component, OnInit} from '@angular/core';
import {Subject, Subscription} from 'rxjs';
import {tap} from 'rxjs/operators';
import {Node} from '../../../service/util/node';
import {NodeService} from '../../../service/node.service';
import {ChipItem} from './tag-input/tag-input.component';
import {Preference} from '../../../service/util/preference.service';
import {Tag} from '../../../service/util/filter';

class ChipItems {
  or: ChipItem[];
  and: ChipItem[];
  not: ChipItem[];
  notAll: boolean;
}

@Component({
  selector: 'app-tag-filter',
  templateUrl: './tag-filter.component.html',
  styleUrls: ['./tag-filter.component.css']
})
export class TagFilterComponent implements OnInit {

  allTags: Node[] = [];

  orTags: ChipItem[] = [];
  andTags: ChipItem[] = [];
  notTags: ChipItem[] = [];

  open = false;
  modified = false;
  notAll = false;
  changed = false;

  private defaultData = JSON.stringify({or: [], and: [], not: [], notAll: false});
  private onChangeSubject = new Subject<void>();
  private static toTags(chipItems: ChipItem[]): Tag[] {
    return chipItems.map(i => ({
      strict: false,
      value: i.title,
      id: i.isNew ? undefined : i.node.mainData.id,
      type: 'tag',
    }));
  }

  reset() {
    this.changed = true;
    this.notAll = false;
    this.orTags.length = 0;
    this.andTags.length = 0;
    this.notTags.length = 0;
  }
  close() {
    this.open = false;
    if (!this.open && this.changed) {
      this.changed = false;
      this.onChangeSubject.next();
      const json = JSON.stringify({
        or: this.orTags,
        and: this.andTags,
        not: this.notTags,
        notAll: this.notAll,
      });
      this.modified = (json !== this.defaultData);
      this.preference.set('saved_tags', json); // Save Tags
    }
  }

  public getTags(): { or: Tag[], and: Tag[], not: Tag[] } {
    return this.notAll ? {
      or: [],
      and: [],
      not: this.allTags.map(i => ({
        strict: false,
        value: undefined,
        id: i.mainData.id,
        type: 'tag',
      })),
    } : {
      or: TagFilterComponent.toTags(this.orTags),
      and: TagFilterComponent.toTags(this.andTags),
      not: TagFilterComponent.toTags(this.notTags),
    };
  }
  public onChange(next?: (value: void) => void, error?: (error: any) => void, complete?: () => void): Subscription {
    return this.onChangeSubject.subscribe(next, error, complete);
  }

  constructor(
    public preference: Preference,
    private nodeService: NodeService,
  ) {
    const savedTags = this.preference.get('saved_tags');
    if (savedTags) {
      this.modified = (savedTags !== this.defaultData);
      const chipItems: ChipItems = JSON.parse(savedTags);
      this.orTags = chipItems.or;
      this.andTags = chipItems.and;
      this.notTags = chipItems.not;
      this.notAll = chipItems.notAll;
    }
  }

  ngOnInit(): void {
    this.nodeService.getAllByType('tag', {permission: 'available'}).pipe(
      tap(tags => {
        this.allTags = tags;
        if (this.notAll) { this.onChangeSubject.next(); }
      })
    ).subscribe();
  }

}
