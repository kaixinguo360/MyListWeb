import {Component, HostListener, Input, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NgxMasonryComponent, NgxMasonryOptions} from 'ngx-masonry';

import {NodeViewer} from '../node-viewer/card-viewer.component';
import {AppConfig} from '../../../environments/app-config';
import {Node} from '../../service/node.service';
import {ViewService} from '../../service/util/view.service';

@Component({
  selector: 'app-masonry',
  templateUrl: './masonry.component.html',
  styleUrls: ['./masonry.component.css']
})
export class MasonryComponent implements OnInit {

  @Input() nodes: Node[];

  containerWidth: number;
  columnWidth = this.view.isMobile ? (window.innerWidth / 2) : AppConfig.columnWidth;

  @ViewChild('masonry', { static: true }) masonry: NgxMasonryComponent;
  masonryOptions: NgxMasonryOptions = {
    initLayout: true,
    transitionDuration: '0',
    columnWidth: this.view.isMobile ? '.item' : this.columnWidth,
    percentPosition: this.view.isMobile,
  };

  click(node: Node) {
    if (node.mainData.type === 'tag') {
      this.router.navigate(['tag'], { queryParams: { id: node.mainData.id } });
    } else {
      this.fileViewer.open(node, this.nodes);
    }
  }
  @HostListener('window:resize') resize() {
    this.containerWidth = this.view.isMobile ? window.innerWidth :
      (Math.max(Math.floor((window.innerWidth - 20) / this.columnWidth), 1) * this.columnWidth);
    this.masonry.layout();
  }
  ngOnInit(): void { this.resize(); }

  constructor(
    private router: Router,
    public view: ViewService,
    public fileViewer: NodeViewer,
  ) { }
}
