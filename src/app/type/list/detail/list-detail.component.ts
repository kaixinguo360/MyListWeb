import {Component, Input} from '@angular/core';

import {Preview} from '../../../component/content/preview/preview';
import {ListItem, Node} from '../../../service/util/node';
import {NodeViewer} from '../../../component/node-viewer/node-viewer.component';

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