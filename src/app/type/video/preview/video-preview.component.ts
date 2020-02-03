import {Component, Input} from '@angular/core';
import {Preview} from '../../../component/content/preview/preview';
import {Node} from '../../../service/util/node';

@Component({
  templateUrl: './video-preview.component.html',
  styleUrls: ['./video-preview.component.css']
})
export class VideoPreviewComponent implements Preview {
  @Input() node: Node;
  @Input() width: number;
  @Input() height: number;
  @Input() maxWidth: number;
  @Input() maxHeight: number;
  loading = true;
}
