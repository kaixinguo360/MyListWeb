import {Component, Input, OnInit} from '@angular/core';

import {Node} from '../../service/node.service';
import {PreviewCard} from '../../com/card/preview/preview-card';

@Component({
  templateUrl: './list-card.component.html',
  styleUrls: ['./list-card.component.css']
})
export class ListCardComponent implements PreviewCard, OnInit {

  @Input() node: Node;
  count: number;

  ngOnInit(): void {
    this.count = Number(this.node.mainData.excerpt);
  }
}
