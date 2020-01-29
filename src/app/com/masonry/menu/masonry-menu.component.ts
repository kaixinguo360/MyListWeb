import {Component, Inject} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material';
import {Node} from '../../../service/node.service';
import {NodeViewer} from '../../node-viewer/card-viewer.component';

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
  open() {
    this.fileViewer.open(this.node);
    this.close();
  }

  constructor(
    public fileViewer: NodeViewer,
    private bottomSheetRef: MatBottomSheetRef<MasonryMenuComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public node: Node,
  ) { }

}
