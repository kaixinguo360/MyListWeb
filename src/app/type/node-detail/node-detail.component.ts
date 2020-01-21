import {Component, Input, OnInit} from '@angular/core';
import {Node} from '../../service/node.service';
import {ContentDetail} from '../content-detail';
import {TypeService} from '../../service/type.service';

@Component({
  selector: 'app-file-detail',
  templateUrl: './node-detail.component.html',
  styleUrls: ['./node-detail.component.css']
})
export class NodeDetailComponent implements ContentDetail, OnInit {
  @Input() node: Node;
  icon: string;
  ext: string;

  ngOnInit(): void {
    const ext = this.node.mainData.title.trim().split('.').pop().toLowerCase();
    const info = this.nodeResolver.resolveExt(ext);
    this.icon = info.icon;
    this.ext = (info.name === 'Unknown File') ? ext : null;
  }

  constructor(
    private nodeResolver: TypeService
  ) { }
}
