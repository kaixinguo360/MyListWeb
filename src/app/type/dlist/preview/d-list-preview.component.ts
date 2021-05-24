import {Component, Input} from '@angular/core';
import {Preview} from '../../../component/content/preview/preview';
import {Node} from '../../../service/util/node';

@Component({
  templateUrl: './d-list-preview.component.html',
  styleUrls: ['./d-list-preview.component.css']
})
export class DListPreviewComponent implements Preview {
  @Input() node: Node;
}
