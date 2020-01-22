import {Component, Input, OnInit} from '@angular/core';

import {Node} from '../../service/node.service';
import {ContentPreview} from '../content-preview';

@Component({
  selector: 'app-dir-card',
  templateUrl: './list-preview.component.html',
  styleUrls: ['./list-preview.component.css']
})
export class ListPreviewComponent implements ContentPreview, OnInit {
  @Input() node: Node;
  @Input() width: number;
  @Input() height: number;
  @Input() maxWidth: number;
  @Input() maxHeight: number;
  count: number;

  ngOnInit(): void {
    this.count = Number(this.node.mainData.excerpt);
  }
}
