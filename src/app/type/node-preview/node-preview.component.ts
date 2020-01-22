import {Component, Input} from '@angular/core';
import {ContentPreview} from '../content-preview';
import {Node} from '../../service/node.service';

@Component({
  selector: 'app-file-card',
  templateUrl: './node-preview.component.html',
  styleUrls: ['./node-preview.component.css']
})
export class NodePreviewComponent implements ContentPreview {
  @Input() node: Node;
  @Input() width: number;
  @Input() height: number;
  @Input() maxWidth: number;
  @Input() maxHeight: number;
}

