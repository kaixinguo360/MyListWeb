import {Component, Input, OnInit} from '@angular/core';
import {Detail} from '../../../component/node-content/detail/detail';
import {Video} from '../type-info';
import {ProxyService} from '../../../service/proxy.service';
import {Node} from '../../../service/node.service';

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
