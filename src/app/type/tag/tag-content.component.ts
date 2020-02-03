import {Component, Input} from '@angular/core';
import {Preview} from '../../component/content/preview/preview';
import {Node} from '../../service/util/node';

@Component({
  templateUrl: './tag-content.component.html',
  styleUrls: ['./tag-content.component.css']
})
export class TagContentComponent implements Preview {
  @Input() node: Node;
}

