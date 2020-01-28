import {Component, OnInit} from '@angular/core';
import {ViewService} from '../../../service/util/view.service';
import {MainData, Node, NodeService} from '../../../service/node.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, Validators} from '@angular/forms';
import {catchError, tap} from 'rxjs/operators';
import {MatSnackBar} from '@angular/material';
import {throwError} from 'rxjs';

@Component({
  selector: 'app-node-edit',
  templateUrl: './node-edit.component.html',
  styleUrls: ['./node-edit.component.css']
})
export class NodeEditComponent implements OnInit {

  mainData = this.fb.group({
    id: null,
    title: this.fb.control(null, Validators.required),
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
  types = ['Node', 'List', 'Tag', 'Text', 'Image', 'Music', 'Video'];
  permissions = ['Private', 'Protect', 'Public'];

  public submit() {
    const mainData: MainData = this.mainData.getRawValue();
    mainData.user = null;
    const node: Node = { mainData, extraData: null, extraList: [] };
    (mainData.id ?
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

  constructor(
    private viewService: ViewService,
    private nodeService: NodeService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(map => {
      const id = Number(map.get('id'));
      if (id) {
        this.viewService.init('Node Edit', ['back']);
        this.viewService.setLoading(true);
        this.nodeService.get(id).subscribe(node => {
          this.mainData.patchValue(node.mainData);
          this.viewService.setLoading(false);
        });
      } else {
        this.viewService.init('New Node', ['back']);
      }
    });
  }
}
