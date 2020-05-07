import {Component, Injectable, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef, MatListOption} from '@angular/material';
import {catchError, map, tap} from 'rxjs/operators';
import {Observable, throwError} from 'rxjs';
import {Tag, TagService} from '../../service/tag.service';
import {ViewService} from '../../service/util/view.service';
import {FormBuilder} from '@angular/forms';

@Component({
  selector: 'app-tag-selector',
  templateUrl: './tag-selector.component.html',
  styleUrls: ['./tag-selector.component.css']
})
export class TagSelectorComponent implements OnInit {

  title: string; // @Input
  multiple: boolean; // @Input
  selected: Tag[]; // @Input

  tags: Tag[];
  showInputBox = false;

  create(name: string) {
    if (name) {
      this.tags.unshift({name});
      this.showInputBox = false;
    } else {
      this.view.alert('Please enter a name for the new tag!');
    }
  }
  selectTag(tag: Tag) {
    this.dialogRef.close(tag);
  }
  selectTags(options: MatListOption[]) {
    this.dialogRef.close(options.map(o => o.value));
  }
  isSelected(tag: Tag): boolean {
    return !!(this.selected && this.selected.find(t => t.id === tag.id));
  }
  close() {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.title = this.title ? this.title :
      (this.multiple ? 'Please select tags' : 'Please select a tag');
    this.tagService.search().pipe(
      tap(tags => {
        this.tags = tags;

        if (this.multiple && this.selected && this.selected.length) {
          const selectedIds: number[] = this.selected.map(tag => tag.id);
          const selectedTags: Tag[] = [];

          for (let i = this.tags.length - 1; i >= 0; i--) {
            const tag = this.tags[i];
            if (selectedIds.indexOf(tag.id) !== -1) {
              this.tags.splice(i, 1);
              selectedTags.push(tag);
            }
          }
          this.tags = selectedTags.concat(this.tags);
        }
      }),
      catchError(err => {
        this.view.alert('An error occurred while fetching the tag info');
        return throwError(err);
      })
    ).subscribe();
  }

  constructor(
    public view: ViewService,
    private dialogRef: MatDialogRef<TagSelectorComponent>,
    private fb: FormBuilder,
    private tagService: TagService,
  ) {}

}

@Injectable({
  providedIn: 'root'
})
export class TagSelector {

  public selectTag(title?: string): Observable<string> {
    const dialogRef = this.createDialogRef();
    const instance = dialogRef.componentInstance;
    instance.title = title;
    instance.multiple = false;
    return dialogRef.afterClosed().pipe(
      map((tag: Tag) => tag ? tag.name : null)
    );
  }
  public selectTags(selected?: Tag[], title?: string): Observable<string[]> {
    const dialogRef = this.createDialogRef();
    const instance = dialogRef.componentInstance;
    instance.title = title;
    instance.multiple = true;
    instance.selected = selected;
    return dialogRef.afterClosed().pipe(
      map((tags: Tag[]) => tags ? tags.map(t => t.name) : null)
    );
  }
  private createDialogRef(): MatDialogRef<TagSelectorComponent> {
    return this.dialog.open(
      TagSelectorComponent, {maxWidth: null, maxHeight: null}
    );
  }

  constructor(
    private dialog: MatDialog,
  ) { }

}
