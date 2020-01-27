import {Component, Input} from '@angular/core';
import {PreviewCard} from '../../../com/card/preview/preview-card';
import {Node} from '../../../service/node.service';

@Component({
  templateUrl: './video-preview.component.html',
  styleUrls: ['./video-preview.component.css']
})
export class VideoPreviewComponent implements PreviewCard {
  @Input() node: Node;
  @Input() width: number;
  @Input() height: number;
  @Input() maxWidth: number;
  @Input() maxHeight: number;
  loading = true;
}
