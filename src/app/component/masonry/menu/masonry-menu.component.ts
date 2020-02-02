import {Component, Inject} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material';
import {NodeService} from '../../../service/node.service';
import {ViewService} from '../../../service/util/view.service';
import {Node} from '../../../service/util/node';

@Component({
  selector: 'app-masonry-menu',
  templateUrl: './masonry-menu.component.html',
  styleUrls: ['./masonry-menu.component.css']
})
export class MasonryMenuComponent {

  canWrite: boolean;

  close() {
    this.bottomSheetRef.dismiss();
  }
  star() {

  }

  constructor(
    public view: ViewService,
    private bottomSheetRef: MatBottomSheetRef<MasonryMenuComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public node: Node,
  ) {
    this.canWrite = NodeService.canWrite(node, view.user);
  }

}
