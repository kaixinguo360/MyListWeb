import {Component, HostListener, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NgxMasonryComponent, NgxMasonryOptions} from 'ngx-masonry';

import {AppConfig} from '../../../environments/app-config';
import {ViewService} from '../../service/util/view.service';

class MasonryItem {
  data: any;
  selected: boolean;
}

@Component({
  selector: 'app-masonry',
  templateUrl: './masonry.component.html',
  styleUrls: ['./masonry.component.css']
})
export class MasonryComponent implements OnInit {

  @Input() template: TemplateRef<any>;
  items: MasonryItem[] = [];

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

  @HostListener('window:resize') resize() {
    this.containerWidth = this.view.isMobile ? window.innerWidth :
      (Math.max(Math.floor((window.innerWidth - 20) / this.columnWidth), 1) * this.columnWidth);
    this.masonry.layout();
  }
  ngOnInit(): void { this.resize(); }

  public setItems(items: any[]) {
    this.items = items.map(data => ({data, selected: false}));
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
  public getSelectedItems<T = any>(): T[] {
    return this.items.filter(item => item.selected).map(item => item.data);
  }

  constructor(
    public view: ViewService,
  ) { }
}
