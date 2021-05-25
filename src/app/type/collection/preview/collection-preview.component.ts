import {AfterContentChecked, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';

import {Preview} from '../../../component/node-content/preview/preview';
import {Node} from '../../../service/node.service';

@Component({
  templateUrl: './collection-preview.component.html',
  styleUrls: ['./collection-preview.component.css']
})
export class CollectionPreviewComponent implements Preview, OnInit, AfterContentChecked {

  static STEP = 16;
  static LIMIT = 4;
  HEIGHT = 200;
  PADDING = 4;

  @Input() node: Node;
  @Input() lazyload: boolean;
  excerptNodes: Node[];
  count: number;
  size: number;

  ngOnInit(): void {
    const json: string = this.node.mainData.excerpt;
    const excerpt = JSON.parse(json);
    this.count = excerpt.count ? excerpt.count : 0;
    this.excerptNodes = (excerpt.excerpts ? excerpt.excerpts : []).map(e => ({ mainData: e }));
    if (this.excerptNodes.length > CollectionPreviewComponent.LIMIT) {
      this.excerptNodes.length = CollectionPreviewComponent.LIMIT;
    }
    this.excerptNodes.reverse();
    this.size = this.HEIGHT - (this.excerptNodes.length - 1) * CollectionPreviewComponent.STEP;
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }

  constructor(private cdref: ChangeDetectorRef) {}
}
