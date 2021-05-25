import {Component, Input} from '@angular/core';
import {Preview} from '../../../component/node-content/preview/preview';
import {Node} from '../../../service/node.service';

@Component({
  templateUrl: './node-content.component.html',
  styleUrls: ['./node-content.component.css']
})
export class NodeContentComponent implements Preview {
  @Input() node: Node;
}

