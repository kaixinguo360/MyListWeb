import {Component} from '@angular/core';
import {ExtraEdit} from '../../../com/extra-edit/extra-edit';
import {ExtraData, NodeService} from '../../../service/node.service';
import {FormBuilder, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {ViewService} from '../../../service/util/view.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-video-edit',
  templateUrl: './video-edit.component.html',
  styleUrls: ['./video-edit.component.css']
})
export class VideoEditComponent implements ExtraEdit {

  public valid = false;
  videoData = this.fb.group({
    type: 'video',
    url: this.fb.control(null, Validators.required),
    format: this.fb.control(null, Validators.required),
  });

  public onChange(next: () => void): Subscription { return this.videoData.statusChanges.subscribe(next); }
  public getExtraData(): ExtraData { return this.videoData.getRawValue(); }
  public setExtraData(extraData: ExtraData) { this.videoData.patchValue(extraData); }

  constructor(
    private viewService: ViewService,
    private nodeService: NodeService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
  ) {
    this.videoData.statusChanges.subscribe(() => this.valid = this.videoData.valid);
  }

}
