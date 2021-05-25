import {Component, Input, OnInit} from '@angular/core';

import {Detail} from '../../../component/node-content/detail/detail';
import {Image} from '../type-info';
import {ProxyService} from '../../../service/proxy.service';
import {Node} from '../../../service/node.service';

@Component({
  templateUrl: './image-detail.component.html',
  styleUrls: ['./image-detail.component.css']
})
export class ImageDetailComponent implements Detail, OnInit {
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

  constructor(
    public proxy: ProxyService,
  ) { }
}
