import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {ViewService} from '../../service/util/view.service';
import {Node, NodeService} from '../../service/node.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, Validators} from '@angular/forms';
import {catchError, tap} from 'rxjs/operators';
import {MatSnackBar} from '@angular/material';
import {throwError} from 'rxjs';
import {ExtraEditComponent} from '../../com/extra-edit/extra-edit.component';
import {TagSelectorComponent} from '../../com/tag-selector/tag-selector.component';

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
    type: this.fb.control('node', Validators.required),
    linkDelete: this.fb.control(false, Validators.required),
    linkVirtual: this.fb.control(false, Validators.required),
    permission: this.fb.control('private', Validators.required),
    nsfw: this.fb.control(false, Validators.required),
    like: this.fb.control(false, Validators.required),
    hide: this.fb.control(false, Validators.required),
    sourceUrl: this.fb.control(null),
    comment: this.fb.control(null),
  });
  // types = ['Node', 'List', 'Tag', 'Text', 'Image', 'Music', 'Video'];
  types = ['Node', 'Tag', 'Image', 'Video'];
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
    const error = this.extraEdit.process(node);
    if (error) { this.view.alert(error); return; }

    (node.mainData.id ?
      this.nodeService.update(node) :
      this.nodeService.add(node)
    ).pipe(
      tap(() => this.router.navigate(['/home'])),
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
    TagSelectorComponent.selectTags(this.tags, {
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

        this.nodeService.get(id).subscribe(node => {
          this.mainData.patchValue(node.mainData);
          this.extraEdit.setExtraData(node.extraData);
          this.extraEdit.setExtraList(node.extraList);
          this.tags = (node.tags as Node[]).filter(tag => {
            const isOthers = tag.mainData.user !== this.view.user.id && tag.mainData.permission !== 'public';
            if (isOthers) { this.othersTags.push(tag); }
            return !isOthers;
          });
        });
      } else {
        this.view.init({title: 'New Node'});
      }
    });
  }

  constructor(
    public view: ViewService,
    private nodeService: NodeService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private ref: ChangeDetectorRef,
  ) { }
}
