import {Component, Input, OnInit} from '@angular/core';

import {NodeService} from '../../service/node.service';
import {ViewService} from '../../service/util/view.service';
import {NodeMenu} from '../node-menu/node-menu.component';
import {Node} from '../../service/util/node';

@Component({
  selector: 'app-masonry-item',
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

  showDesktopIcons = false;
  canWrite: boolean;

  openMenu() {
    this.nodeMenu.open(this.node);
  }
  ngOnInit(): void {
    this.canWrite = NodeService.canWrite(this.node, this.view.user);
  }

  constructor(
    public view: ViewService,
    private nodeMenu: NodeMenu,
  ) { }

}
