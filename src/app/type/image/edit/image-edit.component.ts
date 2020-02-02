import {Component} from '@angular/core';
import {ExtraEdit} from '../../../component/extra-edit/extra-edit';
import {NodeService} from '../../../service/node.service';
import {FormBuilder, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {ViewService} from '../../../service/util/view.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ExtraData} from '../../../service/util/node';

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
    public view: ViewService,
    private nodeService: NodeService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
  ) {
    this.imageData.statusChanges.subscribe(() => this.valid = this.imageData.valid);
  }

}
