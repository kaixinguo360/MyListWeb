import {Component} from '@angular/core';
import {ExtraEdit} from '../../../com/extra-edit/extra-edit';
import {ExtraData, NodeService} from '../../../service/node.service';
import {FormBuilder, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {ViewService} from '../../../service/util/view.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-image-edit',
  templateUrl: './image-edit.component.html',
  styleUrls: ['./image-edit.component.css']
})
export class ImageEditComponent implements ExtraEdit {

  public valid = false;
  imageData = this.fb.group({
    type: 'image',
    url: this.fb.control(null, Validators.required),
    description: this.fb.control(null),
  });

  public onChange(next: () => void): Subscription { return this.imageData.statusChanges.subscribe(next); }
  public getExtraData(): ExtraData { return this.imageData.getRawValue(); }
  public setExtraData(extraData: ExtraData) { this.imageData.patchValue(extraData); }

  constructor(
    private viewService: ViewService,
    private nodeService: NodeService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
  ) {
    this.imageData.statusChanges.subscribe(() => this.valid = this.imageData.valid);
  }

}
