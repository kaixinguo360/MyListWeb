import {Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {MatAutocompleteSelectedEvent} from '@angular/material';
import {map, startWith} from 'rxjs/operators';
import {Node} from '../../../../service/util/node';
import {ViewService} from '../../../../service/util/view.service';

export class ChipItem {
  isNew?: boolean;
  title?: string;
  node?: Node;
  fixed?: boolean;
}

@Component({
  selector: 'app-tag-input',
  templateUrl: './tag-input.component.html',
  styleUrls: ['./tag-input.component.css']
})
export class TagInputComponent {

  @Input() placeholder: string;
  @Input() plaintextTips: string;
  @Input() allTags: Node[];
  @Input() selectedItems: ChipItem[];
  @Input() disabled: boolean;

  // tslint:disable-next-line:no-output-on-prefix
  @Output() onChange: EventEmitter<void> = new EventEmitter<void>();

  filteredTags: Observable<Node[]>;
  chipCtrl = new FormControl();

  @ViewChild('tagInput', {static: false}) tagInput: ElementRef<HTMLInputElement>;

  selected(event: MatAutocompleteSelectedEvent): void {
    this.onChange.emit();
    const value = event.option.value;
    this.selectedItems.push((typeof value === 'string') ? {isNew: true, title: value} : {node: value});
    this.tagInput.nativeElement.value = '';
    this.chipCtrl.setValue(null);
  }
  private _filter(value: any): Node[] {
    return ((typeof value === 'string') ?
        this.allTags.filter(t => t.mainData.title
          .toLowerCase()
          .indexOf(value.toLowerCase()) !== -1)
        : this.allTags
    ).filter(
      t => this.selectedItems
        .filter(n => !n.isNew)
        .map(n => n.node.mainData.id)
        .indexOf(t.mainData.id) === -1
    );
  }

  constructor(
    public view: ViewService,
  ) {
    this.filteredTags = this.chipCtrl.valueChanges.pipe(
      startWith(null),
      map(tag => this._filter(tag)));
  }

}
