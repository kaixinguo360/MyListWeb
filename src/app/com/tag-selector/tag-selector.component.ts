import {Component, OnInit} from '@angular/core';
import {Filter, ListService} from '../../service/list.service';
import {MatDialog, MatDialogRef} from '@angular/material';
import {catchError, tap} from 'rxjs/operators';
import {Observable, throwError} from 'rxjs';
import {Node, NodeService} from '../../service/node.service';
import {ViewService} from '../../service/util/view.service';

@Component({
  selector: 'app-tag-selector',
  templateUrl: './tag-selector.component.html',
  styleUrls: ['./tag-selector.component.css']
})
export class TagSelectorComponent implements OnInit {

  public static dialog: MatDialog; // @Autowired

  title: string; // @Input
  filter: Filter; // @Input
  multi: boolean; // @Input

  tags: Node[];
  showInputBox = false;

  public static getTag(title?: string, filter?: Filter): Observable<Node> {
    const dialogRef = this.createDialogRef();
    const instance = dialogRef.componentInstance;
    instance.title = title;
    instance.filter = filter;
    instance.multi = false;
    return dialogRef.afterClosed();
  }
  public static getTags(title?: string, filter?: Filter): Observable<Node[]> {
    const dialogRef = this.createDialogRef();
    const instance = dialogRef.componentInstance;
    instance.title = title;
    instance.filter = filter;
    instance.multi = true;
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
  selectTags() {
    this.dialogRef.close();
  }
  close() {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.title = this.title ? this.title :
      (this.multi ? '请选择多个标签' : '请选择一个标签');
    this.listService.getAllByType('tag', this.filter).pipe(
      tap(tags => this.tags = tags),
      catchError(err => {
        alert('获取标签信息时出错!');
        return throwError(err);
      })
    ).subscribe();
  }

  constructor(
    public view: ViewService,
    private dialogRef: MatDialogRef<TagSelectorComponent>,
    private nodeService: NodeService,
    private listService: ListService,
  ) {}

}
