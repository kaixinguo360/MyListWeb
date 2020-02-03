import {Component, Inject, Injectable} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheet, MatBottomSheetRef} from '@angular/material';
import {NodeService} from '../../service/node.service';
import {ViewService} from '../../service/util/view.service';
import {Node} from '../../service/util/node';
import {NodeViewer} from '../node-viewer/node-viewer.component';

@Component({
  selector: 'app-node-menu',
  templateUrl: './node-menu.component.html',
  styleUrls: ['./node-menu.component.css']
})
export class NodeMenuComponent {

  public static bottomSheet: MatBottomSheet; // @Autowired
  canWrite: boolean;

  close() {
    this.bottomSheetRef.dismiss();
  }
  star() {

  }

  constructor(
    public view: ViewService,
    public nodeViewer: NodeViewer,
    private bottomSheetRef: MatBottomSheetRef<NodeMenuComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public node: Node,
  ) {
    this.canWrite = NodeService.canWrite(node, this.view.user);
  }

}

@Injectable({
  providedIn: 'root'
})
export class NodeMenu {

  public open(node: Node) {
    this.bottomSheet.open(NodeMenuComponent, {
      data: node, hasBackdrop: true, closeOnNavigation: true,
    }).afterDismissed()
      .subscribe(() => this.view.stopScroll(false));
    this.view.stopScroll(true);
  }

  constructor(
    public view: ViewService,
    private bottomSheet: MatBottomSheet,
  ) { }

}