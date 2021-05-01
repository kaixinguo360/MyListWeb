import {Component, Input} from '@angular/core';

import {Preview} from '../../../component/content/preview/preview';
import {ListItem, Node} from '../../../service/util/node';
import {NodeViewer} from '../../../component/node-viewer/node-viewer.component';

@Component({
  templateUrl: './collection-detail.component.html',
  styleUrls: ['./collection-detail.component.css']
})
export class CollectionDetailComponent implements Preview {

  @Input() node: Node;
  zoom = false;

  click(item: ListItem, index: number) {
    this.nodeViewer.openIds(index, this.node.extraList.map(i => i.node.mainData.id));
  }

  constructor(
    public nodeViewer: NodeViewer,
  ) { }

}
