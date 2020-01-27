import {Component, Input} from '@angular/core';

import {Node} from '../../service/node/node';

@Component({
  selector: 'app-masonry-item',
  templateUrl: './masonry-item.component.html',
  styleUrls: ['./masonry-item.component.css']
})
export class MasonryItemComponent {
  @Input() node: Node;
  @Input() width: number;
  @Input() maxWidth: number;
  @Input() height: number;
  @Input() maxHeight: number;
}
