import {Component, Input, OnInit} from '@angular/core';
import {ExtraData, Node} from '../../../service/node.service';
import {DetailCard} from '../../../com/card/detail/detail-card';

export class Video extends ExtraData {
  url: string;
  format: string;
}

@Component({
  templateUrl: './video-detail.component.html',
  styleUrls: ['./video-detail.component.css']
})
export class VideoDetailComponent implements OnInit, DetailCard  {
  @Input() node: Node;
  video: Video;

  playing = false;
  play($event, player) {
    if (!this.playing) {
      $event.stopPropagation();
      this.playing = true;
      player.play();
    }
  }
  stop($event, player) {
    if (this.playing) {
      $event.stopPropagation();
      this.playing = false;
      player.pause();
    }
  }

  ngOnInit(): void {
    this.video = this.node.extraData as Video;
  }
}
