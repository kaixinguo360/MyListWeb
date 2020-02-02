import {Component, Input} from '@angular/core';
import {PreviewCard} from '../../component/card/preview/preview-card';
import {Node} from '../../service/util/node';

@Component({
  templateUrl: './tag-card.component.html',
  styleUrls: ['./tag-card.component.css']
})
export class TagCardComponent implements PreviewCard {
  @Input() node: Node;
}

