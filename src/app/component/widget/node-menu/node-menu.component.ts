import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {NodeMenu} from '../../node-bottom-sheet/node-bottom-sheet.component';
import {NodeViewer} from '../../node-viewer/node-viewer.component';
import {ViewService} from '../../../service/view.service';
import {Node, NodeService} from '../../../service/node.service';
import {tap} from 'rxjs/operators';

@Component({
  selector: 'app-node-menu',
  templateUrl: './node-menu.component.html',
  styles: ['.container {display: inline-block}'],
})
export class NodeMenuComponent implements OnChanges {

  @Input() node: Node;
  @Input() showViewButton = true;
  @Input() showMoreButton = true;
  canWrite: boolean;

  delete() {
    if (!confirm('Remove this item?')) { return; }
    this.nodeService.delete(this.node.mainData.id)
      .pipe(tap(() => {
        this.view.alert('One item removed.');
      })).subscribe();
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.canWrite = NodeService.canWrite(this.node, this.view.user);
  }

  constructor(
    public view: ViewService,
    public nodeMenu: NodeMenu,
    public nodeViewer: NodeViewer,
    private nodeService: NodeService,
  ) {}
}
