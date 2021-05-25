import {Component, Input} from '@angular/core';

import {Preview} from '../../../component/node-content/preview/preview';
import {ProxyService} from '../../../service/proxy.service';
import {ViewService} from '../../../service/view.service';
import {Node} from '../../../service/node.service';

@Component({
  templateUrl: './image-preview.component.html',
  styleUrls: ['./image-preview.component.css']
})
export class ImagePreviewComponent implements Preview {
  @Input() node: Node;
  @Input() lazyload: boolean;
  loading = true;
  error = false;

  onload(error: boolean) {
    this.loading = false;
    this.error = error;
    this.view.notify('preview@onload');
  }

  constructor(
    public view: ViewService,
    public proxy: ProxyService,
  ) { }
}
