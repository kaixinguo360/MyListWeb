import {Component, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef, MatListOption} from '@angular/material';
import {catchError, tap} from 'rxjs/operators';
import {Observable, throwError} from 'rxjs';
import {NodeService} from '../../service/node.service';
import {ViewService} from '../../service/util/view.service';
import {FormBuilder} from '@angular/forms';
import {Filter} from '../../service/util/filter';
import {Node} from '../../service/util/node';

@Component({
  selector: 'app-tag-selector',
  templateUrl: './tag-selector.component.html',
  styleUrls: ['./tag-selector.component.css']
})
export class TagSelectorComponent implements OnInit {

  public static dialog: MatDialog; // @Autowired

  title: string; // @Input
  filter: Filter; // @Input
  multiple: boolean; // @Input
  selected: Node[]; // @Input

  tags: Node[];
  showInputBox = false;

  public static selectTag(filter?: Filter, title?: string): Observable<Node> {
    const dialogRef = this.createDialogRef();
    const instance = dialogRef.componentInstance;
    instance.title = title;
    instance.filter = filter;
    instance.multiple = false;
    return dialogRef.afterClosed();
  }
  public static selectTags(selected?: Node[], filter?: Filter, title?: string): Observable<Node[]> {
    const dialogRef = this.createDialogRef();
    const instance = dialogRef.componentInstance;
    instance.title = title;
    instance.filter = filter;
    instance.multiple = true;
    instance.selected = selected;
    return dialogRef.afterClosed();
  }
  public static createDialogRef(): MatDialogRef<TagSelectorComponent> {
    return TagSelectorComponent.dialog.open(
      TagSelectorComponent, {maxWidth: null, maxHeight: null}
    );
  }

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
      alert('标签名称不能为空!');
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
      (this.multiple ? '请选择标签' : '请选择一个标签');
    this.nodeService.getAllByType('tag', this.filter).pipe(
      tap(tags => {
        this.tags = tags;

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
        alert('获取标签信息时出错!');
        return throwError(err);
      })
    ).subscribe();
  }

  constructor(
    public view: ViewService,
    private dialogRef: MatDialogRef<TagSelectorComponent>,
    private fb: FormBuilder,
    private nodeService: NodeService,
  ) {}

}
