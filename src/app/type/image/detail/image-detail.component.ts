import {Component, Input, OnInit} from '@angular/core';

import {DetailCard} from '../../../com/card/detail/detail-card';
import {ExtraData, Node} from '../../../service/node.service';

export class Image extends ExtraData {
  url: string;
  description: string;
}

@Component({
  templateUrl: './image-detail.component.html',
  styleUrls: ['./image-detail.component.css']
})
export class ImageDetailComponent implements DetailCard, OnInit {
  @Input() node: Node;
  image: Image;
  loading = true;
  error = false;
  isGIF = false;
  zoom = false;

  ngOnInit(): void {
    this.isGIF = 'gif' === this.node.mainData.excerpt.trim().split('.').pop().toLowerCase();
    this.image = this.node.extraData as Image;
  }
}
