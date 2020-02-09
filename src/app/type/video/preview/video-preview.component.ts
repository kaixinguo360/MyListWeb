import {Component, Input} from '@angular/core';
import {Preview} from '../../../component/content/preview/preview';
import {Node} from '../../../service/util/node';
import {ProxyService} from '../../../service/util/proxy.service';

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
