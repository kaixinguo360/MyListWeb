import {Component, Input, OnInit} from '@angular/core';
import {Detail} from '../../../component/content/detail/detail';
import {Node} from '../../../service/util/node';
import {Video} from '../type-info';
import {ProxyService} from '../../../service/util/proxy.service';

@Component({
  templateUrl: './video-detail.component.html',
  styleUrls: ['./video-detail.component.css']
})
export class VideoDetailComponent implements OnInit, Detail  {
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

  constructor(
    public proxy: ProxyService,
  ) { }
}
