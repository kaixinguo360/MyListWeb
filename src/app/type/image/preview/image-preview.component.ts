import {Component, Input} from '@angular/core';

import {Preview} from '../../../component/content/preview/preview';
import {Node} from '../../../service/util/node';
import {ProxyService} from '../../../service/util/proxy.service';

@Component({
  templateUrl: './image-preview.component.html',
  styleUrls: ['./image-preview.component.css']
})
export class ImagePreviewComponent implements Preview {
  @Input() node: Node;
  loading = true;
  error = false;

  constructor(
    public proxy: ProxyService,
  ) { }
}
