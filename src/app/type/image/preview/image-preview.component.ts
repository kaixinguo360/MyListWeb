import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';

import {PreviewCard} from '../../../com/card/preview/preview-card';
import {Node} from '../../../service/node/node';

@Component({
  templateUrl: './image-preview.component.html',
  styleUrls: ['./image-preview.component.css']
})
export class ImagePreviewComponent implements PreviewCard, OnInit {
  @Input() node: Node;
  @Input() width: number;
  @Input() height: number;
  @Input() maxWidth: number;
  @Input() maxHeight: number;
  @ViewChild('img', { static: true }) imgRef: ElementRef;
  @ViewChild('container', { static: true }) containerRef: ElementRef;
  overflow = false;
  loading = true;
  error = false;
  isGIF = false;

  ngOnInit(): void {
    this.isGIF = 'gif' === this.node.mainData.excerpt.trim().split('.').pop().toLowerCase();
  }

  onload(): void {
    this.overflow = this.imgRef.nativeElement.offsetHeight > this.containerRef.nativeElement.offsetHeight;
    this.loading = false;
  }
}
