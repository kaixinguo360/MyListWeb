import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ViewService} from '../../../system/service/util/view.service';
import {ImageService} from '../image.service';
import {Image} from '../image';
import {MasonryComponent} from '../../../system/component/masonry/masonry.component';
import {Subscription} from 'rxjs';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {OrderService} from '../../../system/service/util/order.service';
import {Tag, TagService} from '../../../system/service/tag.service';
import {Filter, FilterInputComponent} from '../../../system/component/widget/filter-input/filter-input.component';

@Component({
  selector: 'app-image-search',
  templateUrl: './image-search.component.html',
  styleUrls: ['./image-search.component.css']
})
export class ImageSearchComponent implements OnInit, OnDestroy {

  limit = 100;
  page: number;
  filter: Filter = new Filter();

  otherSubs: Subscription[] = [];
  @ViewChild('masonryRef', { read: MasonryComponent, static: true }) masonry: MasonryComponent;
  @ViewChild('tagInputRef', { read: FilterInputComponent, static: true }) tagInput: FilterInputComponent;
  orderConfig = [
    { name: '↑ 修改时间', tip: '最旧在前', icon: 'access_time', order: 'mtime', direction: 'asc' },
    { name: '↓ 修改时间', tip: '最新在前', icon: 'access_time', order: 'mtime', direction: 'desc' },
    { name: '↑ 创建时间', tip: '最旧在前', icon: 'create_new_folder', order: 'ctime', direction: 'asc' },
    { name: '↓ 创建时间', tip: '最新在前', icon: 'create_new_folder', order: 'ctime', direction: 'desc' },
    { name: '↑ 图片名称', tip: 'A在前', icon: 'sort_by_alpha', order: 'pageUrl', direction: 'asc' },
    { name: '↓ 图片名称', tip: 'Z在前', icon: 'sort_by_alpha', order: 'pageUrl', direction: 'desc' },
    { name: '↑ 页面名称', tip: 'A在前', icon: 'sort_by_alpha', order: 'pageTitle', direction: 'asc' },
    { name: '↓ 页面名称', tip: 'Z在前', icon: 'sort_by_alpha', order: 'pageTitle', direction: 'desc' },
  ];
  allTags: Tag[];

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
    this.router.navigate(['/image'], {
      queryParams: {
        andTags: this.filter.andTags.join(),
        orTags: this.filter.orTags.join(),
        notTags: this.filter.notTags.join(),
        includeText: this.filter.includeText.join(),
        excludeText: this.filter.excludeText.join(),
        page: this.page,
      }
    });
  }

  ngOnInit(): void {
    this.otherSubs.push(this.view.notification('preview@onload').subscribe(() => this.masonry.layout()));
    this.otherSubs.push(this.view.notification('order@onchange').subscribe(() => { this.page = 0; location.reload(); }));
    this.tagService.search().subscribe(tags => this.allTags = tags);

    this.route.queryParamMap.subscribe((params: ParamMap) => {
      this.view.init({ title: 'Image' });

      this.page = params.get('page') ? Number(params.get('page')) : 0;
      this.filter = {
        andTags: params.get('andTags') ? params.get('andTags').split(',') : [],
        orTags: params.get('orTags') ? params.get('orTags').split(',') : [],
        notTags: params.get('notTags') ? params.get('notTags').split(',') : [],
        includeText: params.get('includeText') ? params.get('includeText').split(',') : [],
        excludeText: params.get('excludeText') ? params.get('excludeText').split(',') : [],
      };
      this.tagInput.setInput(this.filter);

      this.imageService.search({
        andTags: this.filter.andTags,
        orTags: this.filter.orTags,
        notTags: this.filter.notTags,
        includeText: this.filter.includeText,
        excludeText: this.filter.excludeText,
        limit: this.limit,
        offset: this.page * this.limit,
        order: this.orderService.getOrder('image'),
        direction: this.orderService.getDirection('image'),
      }).subscribe(
        images => {
          this.masonry.setItems(images);
          this.masonry.layout();
        }
      );
    });
  }
  ngOnDestroy(): void {
    this.otherSubs.forEach(sub => sub.unsubscribe());
  }

  constructor(
    public view: ViewService,
    private imageService: ImageService,
    private tagService: TagService,
    private orderService: OrderService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

}
