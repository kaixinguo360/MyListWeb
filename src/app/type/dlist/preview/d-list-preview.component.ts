import {Component, Input} from '@angular/core';
import {Preview} from '../../../component/node-content/preview/preview';
import {Node} from '../../../service/node.service';

@Component({
  templateUrl: './d-list-preview.component.html',
  styleUrls: ['./d-list-preview.component.css']
})
export class DListPreviewComponent implements Preview {
  @Input() node: Node;
}
