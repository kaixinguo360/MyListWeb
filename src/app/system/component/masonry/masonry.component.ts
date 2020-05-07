import {Component, HostListener, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NgxMasonryComponent, NgxMasonryOptions} from 'ngx-masonry';

import {AppConfig} from '../../../../environments/app-config';
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

  public allDisplayed = false;
  public selectMode = false;
  public selectCount = 0;
  public items: MasonryItem[] = [];
  displayItems: MasonryItem[] = [];

  tmpSelected: any[] = [];

  @Input() template: TemplateRef<any>;
  @ViewChild('masonry', { static: true }) masonry: NgxMasonryComponent;
  containerWidth: number;
  columnWidth = this.view.isMobile ? (window.innerWidth / 2) : AppConfig.columnWidth;
  masonryOptions: NgxMasonryOptions = {
    initLayout: true,
    transitionDuration: '0',
    columnWidth: this.view.isMobile ? '.item-container' : this.columnWidth,
    percentPosition: this.view.isMobile,
  };

  public setItems(items: any[]) {

    // Tmp save selected items
    if (this.selectMode) {
      this.tmpSelected = this.tmpSelected.concat(
        this.items.filter(item => item.selected).map(item => item.data)
      );
    }

    this.items = items.map(data => ({data, selected: false}));
    this.displayItems.length = 0;

    this.more();
    this.layout();
  }
  public addItems(items: any[]) {
    const newItems = items.map(data => ({data, selected: false}));
    this.items = this.items.concat(newItems);
    if (this.displayItems.length < 50 && this.items.length > this.displayItems.length) {
      this.displayItems.length = 0;
      this.more();
    }
    this.layout();
  }
  public more() {
    const length = this.view.isMobile ? 50 : 100;
    const start = this.displayItems.length;
    const end = Math.min(start + length, this.items.length);
    this.displayItems = this.displayItems.length ?
      this.displayItems.concat(this.items.slice(start, end)) :
      this.items.slice(start, end);
    this.allDisplayed = this.displayItems.length === this.items.length;
  }

  public toggleSelectMode() {
    this.enableSelectMode(!this.selectMode);
  }
  public enableSelectMode(mode: boolean) {
    this.selectMode = mode;
    if (!mode) {
      this.items.forEach(item => item.selected = false);
      this.selectCount = 0;
      this.tmpSelected.length = 0;
    }
  }
  public selectAll() {
    if (this.items.find(item => !item.selected)) {
      this.items.forEach(item => item.selected = true);
      this.selectCount = this.tmpSelected.length + this.items.length;
    } else {
      this.items.forEach(item => item.selected = false);
      this.selectCount = this.tmpSelected.length;
    }
  }
  public getSelectedItems<T = any>(): T[] {
    // SelectedItems = CurrentSelected + TmpSelected
    return this.tmpSelected.concat(
      this.items.filter(item => item.selected).map(item => item.data)
    );
  }

  public layout() {
    this.masonry.layout();
    this.view.detectChanges();
  }
  @HostListener('window:resize') resize() {
    this.containerWidth = this.view.isMobile ? window.innerWidth :
      (Math.max(Math.floor((window.innerWidth - 20) / this.columnWidth), 1) * this.columnWidth);
    this.masonry.layout();
  }
  ngOnInit(): void { this.resize(); }

  constructor(
    public view: ViewService,
  ) { }
}
