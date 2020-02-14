import {Component, Input, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {QuickEdit} from './quick-edit';
import {Node} from '../../../service/util/node';
import {TypeService} from '../../../service/util/type.service';

@Component({
  selector: 'app-quick-edit',
  templateUrl: './quick-edit.component.html',
  styleUrls: ['./quick-edit.component.css']
})
export class QuickEditComponent implements OnInit, QuickEdit {

  @Input() node: Node;

  @ViewChild('content', { read: ViewContainerRef, static: true }) contentHost: ViewContainerRef;
  content: QuickEdit;
  canEdit: boolean;

  ngOnInit(): void {
    if (this.content) { this.contentHost.remove(); }
    const factory = this.typeService.getQuickEditFactory(this.node.mainData.type);
    if (factory !== null) {
      this.canEdit = true;
      const componentRef = this.contentHost.createComponent(factory);
      this.content = (componentRef.instance as QuickEdit);
      this.content.node = this.node;
    } else {
      this.canEdit = false;
    }
  }

  constructor(
    private typeService: TypeService,
  ) {
  }

}
