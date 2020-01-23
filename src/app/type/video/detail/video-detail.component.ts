import {Component, Input} from '@angular/core';
import {Node} from '../../../service/node.service';
import {DetailCard} from '../../../com/card/detail/detail-card';

@Component({
  templateUrl: './video-detail.component.html',
  styleUrls: ['./video-detail.component.css']
})
export class VideoDetailComponent implements DetailCard  {
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
