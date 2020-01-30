import {Component, Inject} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material';
import {Node} from '../../../service/node.service';

@Component({
  selector: 'app-masonry-menu',
  templateUrl: './masonry-menu.component.html',
  styleUrls: ['./masonry-menu.component.css']
})
export class MasonryMenuComponent {

  close() {
    this.bottomSheetRef.dismiss();
  }
  star() {

  }

  constructor(
    private bottomSheetRef: MatBottomSheetRef<MasonryMenuComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public node: Node,
  ) { }

}
