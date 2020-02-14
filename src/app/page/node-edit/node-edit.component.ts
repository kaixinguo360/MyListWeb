import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {ViewService} from '../../service/util/view.service';
import {NodeService} from '../../service/node.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, Validators} from '@angular/forms';
import {catchError, tap} from 'rxjs/operators';
import {MatSnackBar} from '@angular/material';
import {EMPTY, throwError} from 'rxjs';
import {ExtraEditComponent} from '../../component/edit/extra-edit/extra-edit.component';
import {TagSelector} from '../../component/tag-dialog/tag-dialog.component';
import {Node} from '../../service/util/node';
import {HttpErrorResponse} from '@angular/common/http';
import {TypeInfo, TypeService} from '../../service/util/type.service';
import {Preference} from '../../service/util/preference.service';

@Component({
  selector: 'app-node-edit',
  templateUrl: './node-edit.component.html',
  styleUrls: ['./node-edit.component.css']
})
export class NodeEditComponent implements OnInit {

  showDescription =  this.preference.getSwitch('node-edit@showDescription');
  showComment =  this.preference.getSwitch('node-edit@showComment');
  hasDraft = false;

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
    source: this.fb.control(null),
    description: this.fb.control(null),
    comment: this.fb.control(null),
  });
  types: TypeInfo[] = TypeService.typeInfos;
  permissions = ['private', 'protect', 'public'];

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
    try {
      this.typeService.process(node);
    } catch (err) {
      this.view.alert(err);
      return;
    }

    (node.mainData.id ?
      this.nodeService.update(node) :
      this.nodeService.add(node)
    ).pipe(
      tap(() => {
        this.saveStatus();
        this.route.snapshot.queryParams.outside ?
          this.router.navigate(['/home']) :
          this.view.back();
      }),
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

  draft() {
    if (this.hasDraft) {
      this.preference.remove('node-edit@draft');
    } else {
      const node: Node = {
        mainData: this.mainData.getRawValue(),
        extraData: this.extraEdit.getExtraData(),
        extraList: this.extraEdit.getExtraList(),
        tags: this.tags.map(tag => tag.mainData.id)
      };
      node.mainData.id = null;
      this.preference.set('node-edit@draft', JSON.stringify(node));
    }
    this.hasDraft = !this.hasDraft;
  }
  loadStatus() {
    this.mainData.patchValue({
      type: this.preference.get('node-edit@type', 'node'),
      permission: this.preference.get('node-edit@permission', 'private'),
      nsfw: Boolean(this.preference.get('node-edit@nsfw')),
      like: Boolean(this.preference.get('node-edit@like')),
      hide: Boolean(this.preference.get('node-edit@hide')),
    });
  }
  saveStatus() {
    this.preference.remove('node-edit@draft');
    this.preference.set('node-edit@type', this.mainData.value.type);
    this.preference.set('node-edit@permission', this.mainData.value.permission);
    this.mainData.value.nsfw ? this.preference.set('node-edit@nsfw', 'true') : this.preference.remove('node-edit@nsfw');
    this.mainData.value.like ? this.preference.set('node-edit@like', 'true') : this.preference.remove('node-edit@like');
    this.mainData.value.hide ? this.preference.set('node-edit@hide', 'true') : this.preference.remove('node-edit@hide');
  }

  ngOnInit() {
    this.valid = this.extraEdit.valid;
    this.extraEdit.onChange(() => {
      this.valid = this.mainData.valid && this.extraEdit.valid;
      this.ref.detectChanges();
    });
    this.preference.init();
    this.loadStatus();

    this.route.paramMap.subscribe(map => {
      const id = Number(map.get('id'));
      if (id) {
        this.view.init({title: 'Node Edit'});

        this.nodeService.get(id).pipe(
          tap(node => {
            this.mainData.patchValue(node.mainData);
            this.extraEdit.setExtraData(node.extraData);
            this.extraEdit.setExtraList(node.extraList);
            this.extraEdit.ngOnChanges(null);
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
        const draftStr = this.preference.get('node-edit@draft');
        if (draftStr) {
          if (!this.route.snapshot.queryParams.outside) { this.view.alert('Open a saved draft'); }
          this.view.init({title: 'Draft Node'});

          this.hasDraft = true;
          const draft: Node = JSON.parse(draftStr);

          this.mainData.patchValue(draft.mainData);
          this.extraEdit.setExtraData(draft.extraData);
          this.extraEdit.setExtraList(draft.extraList);
          this.extraEdit.ngOnChanges(null);
          this.tags = draft.tags as Node[];
        } else {
          this.view.init({title: 'New Node'});
        }
      }
    });
  }

  constructor(
    public view: ViewService,
    public typeService: TypeService,
    public preference: Preference,
    private nodeService: NodeService,
    private tagSelector: TagSelector,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private ref: ChangeDetectorRef,
  ) { }
}
