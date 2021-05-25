import {Component, Input} from '@angular/core';
import {Preview} from '../../../component/node-content/preview/preview';
import {ProxyService} from '../../../service/proxy.service';
import {Node} from '../../../service/node.service';

@Component({
  templateUrl: './video-preview.component.html',
  styleUrls: ['./video-preview.component.css']
})
export class VideoPreviewComponent implements Preview {
  @Input() node: Node;
  loading = true;

  constructor(
    public proxy: ProxyService,
  ) { }
}
