import {Component, Input, OnInit} from '@angular/core';

import {Node} from '../../../service/node.service';
import {DetailCard} from '../../../com/card/detail/detail-card';

@Component({
  templateUrl: './image-detail.component.html',
  styleUrls: ['./image-detail.component.css']
})
export class ImageDetailComponent implements DetailCard, OnInit {
  @Input() node: Node;
  loading = true;
  error = false;
  isGIF = false;
  zoom = false;

  ngOnInit(): void {
    this.isGIF = 'gif' === this.node.mainData.title.trim().split('.').pop().toLowerCase();
  }
}
