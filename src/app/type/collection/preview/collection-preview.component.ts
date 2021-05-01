import {Component, Input, OnInit} from '@angular/core';

import {Preview} from '../../../component/content/preview/preview';
import {Node} from '../../../service/util/node';

interface Excerpt {
  type: string;
  excerpt: string;
  count: number;
}

@Component({
  templateUrl: './collection-preview.component.html',
  styleUrls: ['./collection-preview.component.css']
})
export class CollectionPreviewComponent implements Preview, OnInit {

  @Input() node: Node;
  @Input() lazyload: boolean;
  excerptNode: Node;
  excerpt: Excerpt;

  ngOnInit(): void {
    const json: string = this.node.mainData.excerpt;
    this.excerpt = JSON.parse(json);
    this.excerptNode = {
      mainData: {
        type: this.excerpt.type,
        excerpt: this.excerpt.excerpt,
        description: this.excerpt.count + '',
      }
    };
  }
}
