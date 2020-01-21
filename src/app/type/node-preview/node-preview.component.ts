import {Component, Input, OnInit} from '@angular/core';
import {ContentPreview} from '../content-preview';
import {Node} from '../../service/node.service';
import {TypeService} from '../../service/type.service';

@Component({
  selector: 'app-file-card',
  templateUrl: './node-preview.component.html',
  styleUrls: ['./node-preview.component.css']
})
export class NodePreviewComponent implements ContentPreview, OnInit {
  @Input() node: Node;
  @Input() width: number;
  @Input() height: number;
  @Input() maxWidth: number;
  @Input() maxHeight: number;
  icon: string;
  ext: string;

  ngOnInit(): void {
    const ext = this.node.name.trim().split('.').pop().toLowerCase();
    const info = this.nodeResolver.resolveExt(ext);
    this.icon = info.icon;
    this.ext = (info.name === 'Unknown File') ? ext : null;
  }

  constructor(
    private nodeResolver: TypeService
  ) { }
}

