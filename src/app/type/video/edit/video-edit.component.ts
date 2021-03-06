import {Component} from '@angular/core';
import {ExtraEdit} from '../../../component/node-edit/extra-edit/extra-edit';
import {ExtraData, NodeService} from '../../../service/node.service';
import {FormBuilder, Validators} from '@angular/forms';
import {BehaviorSubject, Subscription} from 'rxjs';
import {ViewService} from '../../../service/view.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-video-edit',
  templateUrl: './video-edit.component.html',
  styleUrls: ['./video-edit.component.css']
})
export class VideoEditComponent implements ExtraEdit {

  videoData = this.fb.group({
    nodeType: 'video',
    url: this.fb.control(null, Validators.required),
    format: this.fb.control(null, Validators.required),
  });
  public valid = new BehaviorSubject<boolean>(this.videoData.valid);

  public onChange(next: () => void): Subscription { return this.videoData.statusChanges.subscribe(next); }
  public getExtraData(): ExtraData { return this.videoData.getRawValue(); }
  public setExtraData(extraData: ExtraData) { this.videoData.patchValue(extraData); }

  constructor(
    public view: ViewService,
    private nodeService: NodeService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
  ) {
    this.videoData.statusChanges.subscribe(() => this.valid.next(this.videoData.valid));
  }

}
