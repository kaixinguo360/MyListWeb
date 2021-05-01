import {Component, Input} from '@angular/core';
import {Preview} from '../../../component/content/preview/preview';
import {Node} from '../../../service/util/node';

@Component({
  templateUrl: './tag-preview.component.html',
  styleUrls: ['./tag-preview.component.css']
})
export class TagPreviewComponent implements Preview {
  @Input() node: Node;
}
