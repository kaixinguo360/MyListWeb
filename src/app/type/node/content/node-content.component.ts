import {Component, Input} from '@angular/core';
import {Preview} from '../../../component/content/preview/preview';
import {Node} from '../../../service/util/node';

@Component({
  templateUrl: './node-content.component.html',
  styleUrls: ['./node-content.component.css']
})
export class NodeContentComponent implements Preview {
  @Input() node: Node;
}

