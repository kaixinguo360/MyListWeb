import {Component, Input} from '@angular/core';

import {Preview} from '../../../component/node-content/preview/preview';
import {NodeViewer} from '../../../component/node-viewer/node-viewer.component';
import {ListItem, Node} from '../../../service/node.service';

@Component({
  templateUrl: './list-detail.component.html',
  styleUrls: ['./list-detail.component.css']
})
export class ListDetailComponent implements Preview {

  @Input() node: Node;
  zoom = false;

  click(item: ListItem, index: number) {
    this.nodeViewer.openIds(index, this.node.extraList.map(i => i.node.mainData.id));
  }

  constructor(
    public nodeViewer: NodeViewer,
  ) { }

}
