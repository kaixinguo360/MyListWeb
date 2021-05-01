import {Component, Input} from '@angular/core';

import {Preview} from '../../../component/content/preview/preview';
import {ListItem, Node} from '../../../service/util/node';
import {NodeViewer} from '../../../component/node-viewer/node-viewer.component';
import {NodeService} from '../../../service/node.service';

@Component({
  templateUrl: './tag-detail.component.html',
  styleUrls: ['./tag-detail.component.css']
})
export class TagDetailComponent implements Preview {

  @Input() node: Node;
  zoom = false;

  fetchData() {
    if (!this.node.extraList) {
      this.nodeService.getAll({
        andTags: [{id: this.node.mainData.id}]
      }).subscribe(nodes => {
        this.node.extraList = nodes.map(n => ({
          node: n, status: 'exist'
        }));
      });
    }
  }

  click(item: ListItem, index: number) {
    this.nodeViewer.openIds(index, this.node.extraList.map(i => i.node.mainData.id));
  }

  constructor(
    public nodeViewer: NodeViewer,
    public nodeService: NodeService,
  ) { }

}
