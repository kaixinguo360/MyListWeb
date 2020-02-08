import {Component, Input} from '@angular/core';
import {Node} from '../../../service/util/node';
import {Image} from '../type-info';

@Component({
  templateUrl: './image-quick-edit.component.html',
  styleUrls: ['./image-quick-edit.component.css']
})
export class ImageQuickEditComponent {

  @Input() node: Node<Image>;

}
