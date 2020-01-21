import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';

import {Node} from '../../service/node.service';
import {ContentPreview} from '../content-preview';

@Component({
  selector: 'app-image-card',
  templateUrl: './image-preview.component.html',
  styleUrls: ['./image-preview.component.css']
})
export class ImagePreviewComponent implements ContentPreview, OnInit {
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
    this.isGIF = 'gif' === this.node.name.trim().split('.').pop().toLowerCase();
  }

  onload(): void {
    this.overflow = this.imgRef.nativeElement.offsetHeight > this.containerRef.nativeElement.offsetHeight;
    this.loading = false;
  }
}
