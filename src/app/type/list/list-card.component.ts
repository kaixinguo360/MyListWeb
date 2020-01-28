import {Component, Input, OnInit} from '@angular/core';

import {PreviewCard} from '../../com/card/preview/preview-card';
import {Node} from '../../service/node.service';

interface Excerpt {
  type: string;
  excerpt: string;
  count: number;
}

@Component({
  templateUrl: './list-card.component.html',
  styleUrls: ['./list-card.component.css']
})
export class ListCardComponent implements PreviewCard, OnInit {

  @Input() node: Node;
  excerpt: Excerpt;

  ngOnInit(): void {
    const json: string = this.node.mainData.excerpt;
    this.excerpt = JSON.parse(json);
  }
}
