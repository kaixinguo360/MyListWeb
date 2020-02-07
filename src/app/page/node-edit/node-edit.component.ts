import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {ViewService} from '../../service/util/view.service';
import {NodeService} from '../../service/node.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, Validators} from '@angular/forms';
import {catchError, tap} from 'rxjs/operators';
import {MatSnackBar} from '@angular/material';
import {EMPTY, throwError} from 'rxjs';
import {ExtraEditComponent} from '../../component/extra-edit/extra-edit.component';
import {TagSelector} from '../../component/tag-selector/tag-selector.component';
import {Node} from '../../service/util/node';
import {HttpErrorResponse} from '@angular/common/http';
import {TypeService} from '../../service/util/type.service';

@Component({
  selector: 'app-node-edit',
  templateUrl: './node-edit.component.html',
  styleUrls: ['./node-edit.component.css']
})
export class NodeEditComponent implements OnInit {

  mainData = this.fb.group({
    id: null,
    user: null,
    title: this.fb.control(null),
    type: this.fb.control(TypeService.defaultType.id, Validators.required),
    part: this.fb.control(false, Validators.required),
    collection: this.fb.control(false, Validators.required),
    permission: this.fb.control('private', Validators.required),
    nsfw: this.fb.control(false, Validators.required),
    like: this.fb.control(false, Validators.required),
    hide: this.fb.control(false, Validators.required),
    sourceUrl: this.fb.control(null),
    comment: this.fb.control(null),
  });
  types: string[] = TypeService.typeInfos.map(info => info.id);
  permissions = ['Private', 'Protect', 'Public'];

  @ViewChild('extraDataEdit', {static: true}) extraEdit: ExtraEditComponent;
  valid: boolean;

  tags: Node[] = [];
  othersTags: Node[] = [];

  submit() {
    const node: Node = {
      mainData: this.mainData.getRawValue(),
      extraData: this.extraEdit.getExtraData(),
      extraList: this.extraEdit.getExtraList(),
      tags: this.tags.map(tag => tag.mainData.id)
    };

    if (!this.typeService.process(node)) { return; }

    (node.mainData.id ?
      this.nodeService.update(node) :
      this.nodeService.add(node)
    ).pipe(
      // tap(() => this.router.navigate(['/home'])),
      tap(() => this.view.back()),
      catchError(err => {
        this.snackBar.open('An error occurred.', 'Close');
        return throwError(err);
      })
    ).subscribe();
  }
  delete() {
    if (!confirm('Delete this node?')) { return; }
    this.nodeService.remove(this.mainData.value.id).pipe(
      tap(() => this.router.navigate(['/home'])),
      catchError(err => {
        this.snackBar.open('An error occurred.', 'Close');
        return throwError(err);
      })
    ).subscribe();
  }
  selectTags() {
    this.tagSelector.selectTags(this.tags, {
      permission: 'editable',
      conditions: this.mainData.value.id ? [{column: 'id', oper: '!=', value: this.mainData.value.id}] : null
    }).subscribe(tags => tags ? this.tags = tags : null);
  }
  getTagsInfo(): string {
    if (this.tags.length === 0) {
      return null;
    } else
    if (this.tags.length <= 4) {
      return this.tags.map(tag => tag.mainData.title).join(', ');
    } else {
      return this.tags.slice(0, 4).map(tag => tag.mainData.title).join(', ') + ', ...';
    }
  }

  ngOnInit() {
    this.valid = this.extraEdit.valid;
    this.extraEdit.onChange(() => {
      this.valid = this.mainData.valid && this.extraEdit.valid;
      this.ref.detectChanges();
    });

    this.route.paramMap.subscribe(map => {
      const id = Number(map.get('id'));
      if (id) {
        this.view.init({title: 'Node Edit'});

        this.nodeService.get(id).pipe(
          tap(node => {
            this.mainData.patchValue(node.mainData);
            this.extraEdit.setExtraData(node.extraData);
            this.extraEdit.setExtraList(node.extraList);
            this.tags = (node.tags as Node[]).filter(tag => {
              const isOthers = tag.mainData.user !== this.view.user.id && tag.mainData.permission !== 'public';
              if (isOthers) { this.othersTags.push(tag); }
              return !isOthers;
            });
          }),
          catchError(err => {
            if (err instanceof HttpErrorResponse && err.status === 403) { this.view.back(); }
            return EMPTY;
          }),
        ).subscribe();
      } else {
        this.view.init({title: 'New Node'});
      }
    });
  }

  constructor(
    public view: ViewService,
    private nodeService: NodeService,
    private typeService: TypeService,
    private tagSelector: TagSelector,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private ref: ChangeDetectorRef,
  ) { }
}
