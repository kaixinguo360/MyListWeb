import {Component, Input, OnInit} from '@angular/core';

import {DetailCard} from '../../../component/card/detail/detail-card';
import {Image} from '../image';
import {Node} from '../../../service/util/node';

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
