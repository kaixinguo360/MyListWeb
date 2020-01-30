import {Component, Input} from '@angular/core';

import {Node} from '../../../service/node.service';
import {ViewService} from '../../../service/util/view.service';
import {MatBottomSheet} from '@angular/material';
import {MasonryMenuComponent} from '../menu/masonry-menu.component';

@Component({
  selector: 'app-masonry-item',
  templateUrl: './masonry-item.component.html',
  styleUrls: ['./masonry-item.component.css']
})
export class MasonryItemComponent {
  @Input() node: Node;
  @Input() width: number;
  @Input() maxWidth: number;
  @Input() height: number;
  @Input() maxHeight: number;

  show = false;

  openMenu() {
    this.bottomSheet.open(MasonryMenuComponent, {
      hasBackdrop: true,
      data: this.node
    });
  }

  constructor(
    public view: ViewService,
    private bottomSheet: MatBottomSheet
  ) { }
}
