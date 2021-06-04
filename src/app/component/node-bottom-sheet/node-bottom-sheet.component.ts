import {Component, Inject, Injectable} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheet, MatBottomSheetRef} from '@angular/material';
import {Node, NodeService} from '../../service/node.service';
import {ViewService} from '../../service/view.service';
import {NodeViewer} from '../node-viewer/node-viewer.component';
import {tap} from 'rxjs/operators';
import {NavigationStart, Router} from '@angular/router';

@Component({
  selector: 'app-node-bottom-sheet',
  templateUrl: './node-bottom-sheet.component.html',
  styleUrls: ['./node-bottom-sheet.component.css']
})
export class NodeBottomSheetComponent {

  public static bottomSheet: MatBottomSheet; // @Autowired
  canWrite: boolean;

  close() {
    this.bottomSheetRef.dismiss();
  }
  delete() {
    if (!confirm('Remove this item?')) { return; }
    this.nodeService.delete(this.node.mainData.id)
      .pipe(tap(() => {
        this.view.alert('One item removed.');
        this.close();
      })).subscribe();
  }

  constructor(
    public view: ViewService,
    public nodeViewer: NodeViewer,
    private nodeService: NodeService,
    private bottomSheetRef: MatBottomSheetRef<NodeBottomSheetComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public node: Node,
  ) {
    this.canWrite = NodeService.canWrite(node, this.view.user);
    this.view.notification('node-bottom-sheet@closeAll').subscribe(() => this.close());
  }

}

@Injectable({
  providedIn: 'root'
})
export class NodeMenu {

  public open(node: Node) {
    const currentHref = location.href;
    history.pushState(null, 'Node detail', currentHref);
    this.bottomSheet.open(NodeBottomSheetComponent, {
      data: node, hasBackdrop: true, closeOnNavigation: true,
    }).afterDismissed().subscribe(() => {
      if (location.href === currentHref) { history.back(); }
      this.view.stopScroll(false);
    });
    this.view.stopScroll(true);
  }

  constructor(
    public view: ViewService,
    private bottomSheet: MatBottomSheet,
    private router: Router,
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.view.notify('node-bottom-sheet@closeAll');
      }
    });
  }

}
