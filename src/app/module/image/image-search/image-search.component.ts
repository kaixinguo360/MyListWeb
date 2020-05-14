import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ViewService} from '../../../system/service/util/view.service';
import {ImageService} from '../image.service';
import {Image} from '../image';
import {MasonryComponent} from '../../../system/component/masonry/masonry.component';
import {Subscription} from 'rxjs';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {OrderService} from '../../../system/service/util/order.service';
import {TagService} from '../../../system/service/tag.service';
import {Filter, FilterInputComponent} from '../../../system/component/widget/filter-input/filter-input.component';
import {TagSelector} from '../../../system/component/tag-selector/tag-selector.component';
import {tap} from 'rxjs/operators';
import {UrlService} from '../../../system/service/url.service';

@Component({
  selector: 'app-image-search',
  templateUrl: './image-search.component.html',
  styleUrls: ['./image-search.component.css']
})
export class ImageSearchComponent implements OnInit, OnDestroy {

  page: number;
  filter: Filter = new Filter();

  @ViewChild('masonryRef', { read: MasonryComponent, static: true }) masonry: MasonryComponent;
  @ViewChild('filterInputRef', { read: FilterInputComponent, static: true }) tagInput: FilterInputComponent;
  otherSubs: Subscription[] = [];

  addTag() {
    const images = this.masonry.getSelectedItems<Image>().map(image => image.id);
    this.tagSelector.selectTags().pipe(
      tap(tags => {
        if (!tags) { return; }
        this.imageService.batchAddTags(images, tags).pipe(
          tap(() => {
            this.view.alert('Add tag success!');
            this.masonry.enableSelectMode(false);
            this.fetchData();
          }),
        ).subscribe();
      })
    ).subscribe();
  }
  removeTag() {
    const images = this.masonry.getSelectedItems<Image>().map(image => image.id);
    this.tagSelector.selectTags().pipe(
      tap(tags => {
        if (!tags) { return; }
        this.imageService.batchRemoveTags(images, tags).pipe(
          tap(() => {
            this.view.alert('Remove tag success!');
            this.masonry.enableSelectMode(false);
            this.fetchData();
          }),
        ).subscribe();
      })
    ).subscribe();
  }

  search(filter: Filter) {
    this.page = 0;
    this.filter = filter;
    this.update();
  }
  toPage(page: number) {
    this.page = page;
    this.update();
    scrollTo(0, 0);
  }
  update() {
    this.urlService.jump('/image', this.filter, this.page);
  }

  fetchData() {
    this.imageService.search(this.filter, this.page).pipe(
      tap(images => { this.masonry.setItems(images); this.masonry.layout(); })
    ).subscribe();
  }

  ngOnInit(): void {
    this.otherSubs.push(this.view.notification('node@onchange').subscribe(() => this.fetchData()));
    this.otherSubs.push(this.view.notification('order@onchange').subscribe(() => { this.page = 0; this.fetchData(); }));
    this.otherSubs.push(this.view.notification('preview@onload').subscribe(() => this.masonry.layout()));

    this.route.queryParamMap.subscribe((params: ParamMap) => {
      this.view.init({ title: 'Image' });

      this.page = this.urlService.getPage(params);
      this.filter = this.urlService.getFilter(params);
      this.tagInput.setInput(this.filter);

      this.fetchData();
    });
  }
  ngOnDestroy(): void {
    this.otherSubs.forEach(sub => sub.unsubscribe());
  }

  constructor(
    public view: ViewService,
    public imageService: ImageService,
    private orderService: OrderService,
    public tagService: TagService,
    private tagSelector: TagSelector,
    private urlService: UrlService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

}
