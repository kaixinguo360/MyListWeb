import {Component, Input} from '@angular/core';
import {Image} from '../type-info';
import {Node} from '../../../service/node.service';

@Component({
  templateUrl: './image-quick-edit.component.html',
  styleUrls: ['./image-quick-edit.component.css']
})
export class ImageQuickEditComponent {

  @Input() node: Node<Image>;

}
