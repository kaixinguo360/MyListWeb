import {Component, Injectable, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef, MatListOption} from '@angular/material';
import {catchError, tap} from 'rxjs/operators';
import {Observable, throwError} from 'rxjs';
import {Filter, Node, NodeService} from '../../service/node.service';
import {ViewService} from '../../service/view.service';
import {FormBuilder} from '@angular/forms';
import {ClipboardService} from '../../service/clipboard.service';
import {TypeService} from '../../service/type.service';

@Component({
  selector: 'app-tag-dialog',
  templateUrl: './tag-dialog.component.html',
  styleUrls: ['./tag-dialog.component.css']
})
export class TagDialogComponent implements OnInit {

  title: string; // @Input
  filter: Filter; // @Input
  multiple: boolean; // @Input
  selected: Node[]; // @Input

  tags: Node[];
  showInputBox = false;

  create(title: string) {
    if (title) {

      const node = NodeService.emptyNode();
      node.mainData.title = title;
      node.mainData.type = 'tag';

      this.nodeService.add(node).subscribe(tag => {
        this.tags.unshift(tag);
        this.showInputBox = false;
      });
    } else {
      this.view.alert('Please enter a title for the new tag!');
    }
  }
  selectTag(tag: Node) {
    this.dialogRef.close(tag);
  }
  selectTags(options: MatListOption[]) {
    this.dialogRef.close(options.map(o => o.value));
  }
  isSelected(tag: Node): boolean {
    return !!(this.selected && this.selected.find(t => t.mainData.id === tag.mainData.id));
  }
  close() {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.title = this.title ? this.title :
      (this.multiple ? 'Please select tags' : 'Please select a tag');
    this.nodeService.getAllByType(['tag', 'dlist'], this.filter).pipe(
      tap(tags => {
        this.tags = tags;

        this.tags.sort((a, b) => {
          if (a.mainData.type === b.mainData.type) {
            return 0;
          } else if (a.mainData.type === 'tag') {
            return 1;
          } else if (b.mainData.type === 'tag') {
            return -1;
          }
        });

        if (this.clipboard.isCollection) {
          this.tags = this.clipboard.get().concat(this.tags.concat());
        }

        if (this.multiple && this.selected && this.selected.length) {
          const selectedIds: number[] = this.selected.map(tag => tag.mainData.id);
          const selectedTags: Node[] = [];

          for (let i = this.tags.length - 1; i >= 0; i--) {
            const tag = this.tags[i];
            if (selectedIds.indexOf(tag.mainData.id) !== -1) {
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
    public typeService: TypeService,
    private dialogRef: MatDialogRef<TagDialogComponent>,
    private fb: FormBuilder,
    private nodeService: NodeService,
    private clipboard: ClipboardService,
  ) {}

}

@Injectable({
  providedIn: 'root'
})
export class TagSelector {

  public selectTag(filter?: Filter, title?: string): Observable<Node> {
    const dialogRef = this.createDialogRef();
    const instance = dialogRef.componentInstance;
    instance.title = title;
    instance.filter = filter;
    instance.multiple = false;
    return dialogRef.afterClosed();
  }
  public selectTags(selected?: Node[], filter?: Filter, title?: string): Observable<Node[]> {
    const dialogRef = this.createDialogRef();
    const instance = dialogRef.componentInstance;
    instance.title = title;
    instance.filter = filter ? filter : {};
    instance.filter.sorts = [{ property: 'node_title', direction: 'asc' }];
    instance.multiple = true;
    instance.selected = selected;
    return dialogRef.afterClosed();
  }
  private createDialogRef(): MatDialogRef<TagDialogComponent> {
    return this.dialog.open(
      TagDialogComponent, {maxWidth: null, maxHeight: null}
    );
  }

  constructor(
    private dialog: MatDialog,
  ) { }

}
