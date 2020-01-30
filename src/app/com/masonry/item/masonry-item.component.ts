import {Component, Input, OnInit} from '@angular/core';

import {Node, NodeService} from '../../../service/node.service';
import {ViewService} from '../../../service/util/view.service';
import {MatBottomSheet} from '@angular/material';
import {MasonryMenuComponent} from '../menu/masonry-menu.component';

@Component({
  selector: 'app-masonry-item',
  templateUrl: './masonry-item.component.html',
  styleUrls: ['./masonry-item.component.css']
})
export class MasonryItemComponent implements OnInit {
  @Input() node: Node;
  @Input() width: number;
  @Input() maxWidth: number;
  @Input() height: number;
  @Input() maxHeight: number;

  show = false;
  canWrite: boolean;

  openMenu() {
    this.bottomSheet.open(MasonryMenuComponent, {
      hasBackdrop: true,
      data: this.node
    });
  }

  ngOnInit(): void {
    this.canWrite = NodeService.canWrite(this.node, this.view.user);
  }

  constructor(
    public view: ViewService,
    private bottomSheet: MatBottomSheet
  ) { }
}
