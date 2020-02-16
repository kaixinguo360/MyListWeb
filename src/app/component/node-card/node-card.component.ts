import {Component, Input, OnInit} from '@angular/core';

import {NodeService} from '../../service/node.service';
import {ViewService} from '../../service/util/view.service';
import {NodeMenu} from '../node-bottom-sheet/node-bottom-sheet.component';
import {Node} from '../../service/util/node';

@Component({
  selector: 'app-node-card',
  templateUrl: './node-card.component.html',
  styleUrls: ['./node-card.component.css']
})
export class NodeCardComponent implements OnInit {

  @Input() node: Node;
  @Input() width: number;
  @Input() maxWidth: number;
  @Input() height: number;
  @Input() maxHeight: number;
  @Input() interact = true;
  @Input() lazyload = false;

  showDesktopIcons = false;
  canWrite: boolean;
  hasInfo: boolean;

  openMenu() {
    this.nodeMenu.open(this.node);
  }
  ngOnInit(): void {
    this.canWrite = NodeService.canWrite(this.node, this.view.user);
    this.hasInfo = !!(this.node.mainData.title || this.node.mainData.description || this.node.mainData.comment);
  }

  constructor(
    public view: ViewService,
    private nodeMenu: NodeMenu,
  ) { }

}
