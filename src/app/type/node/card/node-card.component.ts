import {Component, Input} from '@angular/core';
import {PreviewCard} from '../../../component/card/preview/preview-card';
import {Node} from '../../../service/util/node';

@Component({
  templateUrl: './node-card.component.html',
  styleUrls: ['./node-card.component.css']
})
export class NodeCardComponent implements PreviewCard {
  @Input() node: Node;
}

