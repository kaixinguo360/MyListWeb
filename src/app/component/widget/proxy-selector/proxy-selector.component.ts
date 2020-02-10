import {Component} from '@angular/core';
import {ProxyService} from '../../../service/util/proxy.service';

@Component({
  selector: 'app-proxy-selector',
  templateUrl: './proxy-selector.component.html',
  styles: ['.menu-select { font-weight: bold; }']
})
export class ProxySelectorComponent {
  constructor(public proxy: ProxyService) {}
}
