import {Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NgxMasonryComponent, NgxMasonryOptions} from 'ngx-masonry';

import {NodeViewer} from '../node-viewer/card-viewer.component';
import {AppConfig} from '../../../environments/app-config';
import {ViewService} from '../../service/util/view.service';
import {Node} from '../../service/util/node';

class NodeItem {
  node: Node;
  selected: boolean;
}

@Component({
  selector: 'app-masonry',
  templateUrl: './masonry.component.html',
  styleUrls: ['./masonry.component.css']
})
export class MasonryComponent implements OnInit {

  items: NodeItem[] = [];

  containerWidth: number;
  columnWidth = this.view.isMobile ? (window.innerWidth / 2) : AppConfig.columnWidth;

  public selectMode = false;
  public selectCount = 0;

  @ViewChild('masonry', { static: true }) masonry: NgxMasonryComponent;
  masonryOptions: NgxMasonryOptions = {
    initLayout: true,
    transitionDuration: '0',
    columnWidth: this.view.isMobile ? '.item-container' : this.columnWidth,
    percentPosition: this.view.isMobile,
  };

  click(node: Node) {
    if (node.mainData.type === 'tag') {
      this.router.navigate(['tag'], { queryParams: { id: node.mainData.id } });
    } else {
      this.fileViewer.open(node, this.items.map(item => item.node));
    }
  }
  @HostListener('window:resize') resize() {
    this.containerWidth = this.view.isMobile ? window.innerWidth :
      (Math.max(Math.floor((window.innerWidth - 20) / this.columnWidth), 1) * this.columnWidth);
    this.masonry.layout();
  }
  ngOnInit(): void { this.resize(); }

  public setNodes(nodes: Node[]) {
    this.items = nodes.map(node => ({node, selected: false}));
    this.masonry.layout();
  }
  public enableSelectMode(mode: boolean) {
    this.selectMode = mode;
    if (!mode) {
      this.items.forEach(item => item.selected = false);
      this.selectCount = 0;
    }
  }
  public selectAll() {
    if (this.items.find(item => !item.selected)) {
      this.items.forEach(item => item.selected = true);
      this.selectCount = this.items.length;
    } else {
      this.items.forEach(item => item.selected = false);
      this.selectCount = 0;
    }
  }
  public getSelectedItems(): Node[] {
    return this.items.filter(item => item.selected).map(item => item.node);
  }

  constructor(
    private router: Router,
    public view: ViewService,
    public fileViewer: NodeViewer,
  ) { }
}
