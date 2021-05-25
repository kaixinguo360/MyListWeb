import {Component, Input} from '@angular/core';
import {Preview} from '../../../component/node-content/preview/preview';
import {Node} from '../../../service/node.service';

@Component({
  templateUrl: './tag-preview.component.html',
  styleUrls: ['./tag-preview.component.css']
})
export class TagPreviewComponent implements Preview {
  @Input() node: Node;
}
