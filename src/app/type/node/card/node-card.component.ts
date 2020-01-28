import {Component, Input} from '@angular/core';
import {PreviewCard} from '../../../com/card/preview/preview-card';
import {Node} from '../../../service/node.service';

@Component({
  templateUrl: './node-card.component.html',
  styleUrls: ['./node-card.component.css']
})
export class NodeCardComponent implements PreviewCard {
  @Input() node: Node;
}

