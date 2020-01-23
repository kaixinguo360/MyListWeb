import {Component, Input} from '@angular/core';
import {Node} from '../../service/node.service';
import {PreviewCard} from '../../com/card/preview/preview-card';

@Component({
  templateUrl: './node-card.component.html',
  styleUrls: ['./node-card.component.css']
})
export class NodeCardComponent implements PreviewCard {
  @Input() node: Node;
}

