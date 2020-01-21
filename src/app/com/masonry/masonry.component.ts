import {Component, HostListener, Input, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NgxMasonryComponent, NgxMasonryOptions} from 'ngx-masonry';

import {Node} from '../../service/node.service';
import {NodeViewer} from '../node-viewer/node-viewer.component';
import {AppConfig} from '../../../environments/app-config';
import {PreferenceService} from '../../service/preference.service';

@Component({
  selector: 'app-masonry',
  templateUrl: './masonry.component.html',
  styleUrls: ['./masonry.component.css']
})
export class MasonryComponent implements OnInit {
  @Input() nodes: Node[];

  @ViewChild('masonry', { static: true }) masonry: NgxMasonryComponent;
  isMobile = window.innerWidth < AppConfig.mobileWidth;
  mobileColumn = this.preference.getNumber('mobileColumn', AppConfig.defaultMobileColumn);
  columnWidth = this.isMobile ? (window.innerWidth / 2) : AppConfig.columnWidth;
  columnMargin = AppConfig.columnMargin;
  containerWidth;
  masonryOptions: NgxMasonryOptions = {
    columnWidth: this.isMobile ? '.card-warp' : this.columnWidth,
    percentPosition: this.isMobile,
  };

  click(node: Node) {
    if (node.mainData.type === 'dir') {
      this.router.navigate(['dir'], { queryParams: { id: node.mainData.id } });
    } else {
      this.fileViewer.open(node, this.nodes);
    }
  }
  @HostListener('window:resize') resize() {
    this.containerWidth = this.isMobile ? window.innerWidth :
      ((Math.round(window.innerWidth / this.columnWidth) - 1) * this.columnWidth);
    this.masonry.layout();
  }
  ngOnInit(): void { this.resize(); }

  constructor(
    private router: Router,
    public fileViewer: NodeViewer,
    public preference: PreferenceService,
  ) { }
}
