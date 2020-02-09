import {Component} from '@angular/core';
import {ProxyService} from '../../../service/util/proxy.service';

@Component({
  selector: 'app-proxy-filter',
  templateUrl: './proxy-filter.component.html',
  styles: ['.menu-select { font-weight: bold; }']
})
export class ProxyFilterComponent {
  constructor(public proxy: ProxyService) {}
}
