import {Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {MatAutocompleteSelectedEvent} from '@angular/material';
import {map, startWith} from 'rxjs/operators';
import {ViewService} from '../../../service/util/view.service';
import {Tag} from '../../../service/tag.service';

declare type Mode = 'and' | 'or' | 'not';
declare type Type = 'tag' | 'text';

export class Filter {
  andTags: string[] = [];
  orTags: string[] = [];
  notTags: string[] = [];
  includeText: string[] = [];
  excludeText: string[] = [];
}
export class ChipItem {
  mode: Mode;
  type: Type;
  value: Tag | string;
  fixed?: boolean;
}

@Component({
  selector: 'app-filter-input',
  templateUrl: './filter-input.component.html',
  styleUrls: ['./filter-input.component.css']
})
export class FilterInputComponent {

  @Input() placeholder = 'Input';
  @Input() plaintextTips: string;
  @Input() allTags: Tag[] = [];
  @Input() chipItems: ChipItem[] = [];
  @Input() disabled = false;

  // tslint:disable-next-line:no-output-on-prefix
  @Output() onChange: EventEmitter<Filter> = new EventEmitter<Filter>();

  autocompleteOptions: Observable<ChipItem[]>;
  chipCtrl = new FormControl();

  @ViewChild('input', {static: false}) input: ElementRef<HTMLInputElement>;

  public setInput(input: Filter) {
    this.chipItems.length = 0;
    input.andTags.forEach(tag => this.chipItems.push({mode: 'and', type: 'tag', value: {name: tag}}));
    input.orTags.forEach(tag => this.chipItems.push({mode: 'or', type: 'tag', value: {name: tag}}));
    input.notTags.forEach(tag => this.chipItems.push({mode: 'not', type: 'tag', value: {name: tag}}));
    input.includeText.forEach(text => this.chipItems.push({mode: 'and', type: 'text', value: text}));
    input.excludeText.forEach(text => this.chipItems.push({mode: 'not', type: 'text', value: text}));
  }
  public getInput(): Filter {
    const event = {
      andTags: [],
      orTags: [],
      notTags: [],
      includeText: [],
      excludeText: [],
    };
    this.chipItems.forEach(item => {
      switch (item.type) {
        case 'tag':
          const tag: Tag = item.value as Tag;
          if (item.mode === 'and') { event.andTags.push(tag.name); }
          if (item.mode === 'or') { event.orTags.push(tag.name); }
          if (item.mode === 'not') { event.notTags.push(tag.name); }
          break;
        case 'text':
          if (item.mode === 'not') {
            event.excludeText.push(item.value);
          } else {
            event.includeText.push(item.value);
          }
      }
    });
    return event;
  }

  change() {
    this.onChange.emit(this.getInput());
  }

  optionSelected(event: MatAutocompleteSelectedEvent): void {
    this.chipItems.push(event.option.value);

    this.input.nativeElement.value = '';
    this.chipCtrl.setValue(null);
    this.change();
  }
  onValueChange(value: any): ChipItem[] {
    if (typeof value === 'string') {
      let mode: Mode;
      let inputText: string;

      switch (value.slice(0, 1)) {
        case '-':
          mode = 'not';
          inputText = value.slice(1);
          break;
        case '+':
          mode = 'or';
          inputText = value.slice(1);
          break;
        default:
          mode = 'and';
          inputText = value;
      }

      const tags: ChipItem[] = this.allTags.filter(t => t.name
        .toLowerCase()
        .indexOf(inputText.toLowerCase()) !== -1)
        .map(tag => ({mode, type: 'tag', value: tag}));
      tags.unshift({mode, type: 'text', value: inputText});

      return tags;
    } else {
      return null;
    }
  }

  constructor(
    public view: ViewService,
  ) {
    this.autocompleteOptions = this.chipCtrl.valueChanges.pipe(
      startWith(null),
      map(tag => this.onValueChange(tag)));
  }

}
