import {Component, Input} from '@angular/core';
import {ContentDetail} from '../content-detail';
import {Node} from '../../service/node.service';

@Component({
  selector: 'app-video-detail',
  templateUrl: './video-detail.component.html',
  styleUrls: ['./video-detail.component.css']
})
export class VideoDetailComponent implements ContentDetail  {
  @Input() node: Node;
  playing = false;
  play($event, video) {
    if (!this.playing) {
      $event.stopPropagation();
      this.playing = true;
      video.play();
    }
  }
  stop($event, video) {
    if (this.playing) {
      $event.stopPropagation();
      this.playing = false;
      video.pause();
    }
  }
}
