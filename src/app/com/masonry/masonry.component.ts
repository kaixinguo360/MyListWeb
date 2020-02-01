import {Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NgxMasonryComponent, NgxMasonryOptions} from 'ngx-masonry';

import {NodeViewer} from '../node-viewer/card-viewer.component';
import {AppConfig} from '../../../environments/app-config';
import {Node} from '../../service/node.service';
import {ViewService} from '../../service/util/view.service';
import {Subject} from 'rxjs';

class NodeItem extends Node {
  selected: boolean;
}

@Component({
  selector: 'app-masonry',
  templateUrl: './masonry.component.html',
  styleUrls: ['./masonry.component.css']
})
export class MasonryComponent implements OnInit {

  nodes: NodeItem[] = [];

  containerWidth: number;
  columnWidth = this.view.isMobile ? (window.innerWidth / 2) : AppConfig.columnWidth;

  public selectMode = false;
  selectSubject: Subject<Node> = new Subject();

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
      this.fileViewer.open(node, this.nodes);
    }
  }
  @HostListener('window:resize') resize() {
    this.containerWidth = this.view.isMobile ? window.innerWidth :
      (Math.max(Math.floor((window.innerWidth - 20) / this.columnWidth), 1) * this.columnWidth);
    this.masonry.layout();
  }
  ngOnInit(): void { this.resize(); }

  public setNodes(nodes: Node[]) {
    this.nodes = nodes as NodeItem[];
    this.masonry.layout();
  }
  public enableSelectMode(mode: boolean) {
    this.selectMode = mode;
    if (!mode) {
      this.nodes.forEach(node => node.selected = false);
    }
  }
  public selectAll() {
    if (this.nodes.find(i => !i.selected)) {
      this.nodes.forEach(node => node.selected = true);
    } else {
      this.nodes.forEach(node => node.selected = false);
    }
  }
  public getSelectedItems(): Node[] {
    return this.nodes.filter(i => i.selected);
  }

  constructor(
    private router: Router,
    public view: ViewService,
    public fileViewer: NodeViewer,
  ) { }
}
