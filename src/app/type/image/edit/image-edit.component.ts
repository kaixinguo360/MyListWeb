import {Component} from '@angular/core';
import {ExtraEdit} from '../../../component/node-edit/extra-edit/extra-edit';
import {ExtraData, NodeService} from '../../../service/node.service';
import {FormBuilder, Validators} from '@angular/forms';
import {BehaviorSubject} from 'rxjs';
import {ViewService} from '../../../service/view.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-image-edit',
  templateUrl: './image-edit.component.html',
  styleUrls: ['./image-edit.component.css']
})
export class ImageEditComponent implements ExtraEdit {

  imageData = this.fb.group({
    nodeType: 'image',
    url: this.fb.control(null, Validators.required),
    type: this.fb.control(null),
    author: this.fb.control(null),
    gallery: this.fb.control(null),
    source: this.fb.control(null),
  });

  public valid = new BehaviorSubject<boolean>(this.imageData.valid);
  public getExtraData(): ExtraData { return this.imageData.getRawValue(); }
  public setExtraData(extraData: ExtraData) { this.imageData.patchValue(extraData); }

  constructor(
    public view: ViewService,
    private nodeService: NodeService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
  ) {
    this.imageData.statusChanges.subscribe(() => this.valid.next(this.imageData.valid));
  }

}
