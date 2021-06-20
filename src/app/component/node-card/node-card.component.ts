import {Component, Input, OnInit} from '@angular/core';

import {Node, NodeService} from '../../service/node.service';
import {ViewService} from '../../service/view.service';
import {NodeMenu} from '../node-bottom-sheet/node-bottom-sheet.component';
import {TypeService} from '../../service/type.service';

export class TextInfo {
  title?: string;
  description?: string;
  comment?: string;
}

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
  textInfo: TextInfo;

  openMenu() {
    this.nodeMenu.open(this.node);
  }
  ngOnInit(): void {
    this.canWrite = NodeService.canWrite(this.node, this.view.user);
    this.textInfo = this.typeService.getTextInfo(this.node);
    if (this.textInfo && !this.textInfo.title && !this.textInfo.description && !this.textInfo.comment) {
      this.textInfo = null;
    }
  }

  constructor(
    public view: ViewService,
    private nodeMenu: NodeMenu,
    private typeService: TypeService,
  ) { }

}
