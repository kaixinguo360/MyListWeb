import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {MatAutocompleteSelectedEvent} from '@angular/material';
import {map, startWith} from 'rxjs/operators';
import {ViewService} from '../../../../service/view.service';
import {ClipboardService} from '../../../../service/clipboard.service';
import {TypeService} from '../../../../service/type.service';
import {Node} from '../../../../service/node.service';

export class Keyword {
  isNew?: boolean;
  title?: string;
  node?: Node;
  fixed?: boolean;
}

@Component({
  selector: 'app-keyword-input',
  templateUrl: './keyword-input.component.html',
  styleUrls: ['./keyword-input.component.css']
})
export class KeywordInputComponent implements OnInit {

  @Input() placeholder: string;
  @Input() plaintextTips: string;
  @Input() allTags: Node[];
  @Input() selectedItems: Keyword[];
  @Input() disabled: boolean;

  // tslint:disable-next-line:no-output-on-prefix
  @Output() onChange: EventEmitter<void> = new EventEmitter<void>();

  // tslint:disable-next-line:no-output-on-prefix
  @Output() onComplete: EventEmitter<void> = new EventEmitter<void>();

  filteredTags: Observable<Node[]>;
  chipCtrl = new FormControl();
  allCollections: Node[];

  @ViewChild('keywordInput', {static: false}) keywordInput: ElementRef<HTMLInputElement>;

  keydown() {
    if (!this.keywordInput.nativeElement.value) {
      this.onComplete.emit();
    }
  }
  selected(event: MatAutocompleteSelectedEvent): void {
    this.onChange.emit();
    const value = event.option.value;
    this.selectedItems.push((typeof value === 'string') ? {isNew: true, title: value} : {node: value});
    this.keywordInput.nativeElement.value = '';
    this.chipCtrl.setValue(null);
  }
  private _filter(value: any): Node[] {
    return ((typeof value === 'string') ?
        this.allCollections.filter(t => t.mainData.title
          .toLowerCase()
          .indexOf(value.toLowerCase()) !== -1)
        : this.allCollections
    ).filter(
      t => this.selectedItems
        .filter(n => !n.isNew)
        .map(n => n.node.mainData.id)
        .indexOf(t.mainData.id) === -1
    );
  }

  ngOnInit(): void {
    this.allCollections = this.allTags;
    if (this.clipboard.isCollection) {
      this.allCollections = this.clipboard.get().concat(this.allCollections);
    }
  }

  constructor(
    public view: ViewService,
    public typeService: TypeService,
    public clipboard: ClipboardService,
  ) {
    this.filteredTags = this.chipCtrl.valueChanges.pipe(
      startWith(null),
      map(tag => this._filter(tag)));
  }

}
