import {Component, ElementRef, Input, ViewChild} from '@angular/core';

import {PreviewCard} from '../../../component/card/preview/preview-card';
import {Node} from '../../../service/util/node';

@Component({
  templateUrl: './image-preview.component.html',
  styleUrls: ['./image-preview.component.css']
})
export class ImagePreviewComponent implements PreviewCard {
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

  onload(): void {
    this.overflow = this.imgRef.nativeElement.offsetHeight > this.containerRef.nativeElement.offsetHeight;
    this.loading = false;
  }
}
