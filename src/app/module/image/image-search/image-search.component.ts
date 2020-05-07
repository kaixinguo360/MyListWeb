import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ViewService} from '../../../system/service/util/view.service';
import {ImageService} from '../image.service';
import {Image} from '../image';
import {MasonryComponent} from '../../../system/component/masonry/masonry.component';
import {Subscription} from 'rxjs';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {OrderService} from '../../../system/service/util/order.service';

@Component({
  selector: 'app-image-search',
  templateUrl: './image-search.component.html',
  styleUrls: ['./image-search.component.css']
})
export class ImageSearchComponent implements OnInit, OnDestroy {

  allDisplayed = false;
  limit = 100;
  page: number;
  andTags: string[];
  orTags: string[];
  notTags: string[];
  includeText: string[];
  excludeText: string[];

  otherSubs: Subscription[] = [];
  @ViewChild('masonryRef', { read: MasonryComponent, static: true }) masonry: MasonryComponent;
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

  toPage(page: number) {
    this.router.navigate(['/image'], {
      queryParams: {
        andTags: this.andTags.join(),
        orTags: this.orTags.join(),
        notTags: this.notTags.join(),
        includeText: this.includeText.join(),
        excludeText: this.excludeText.join(),
        page,
      }
    });
    scrollTo(0, 0);
  }

  ngOnInit(): void {
    this.otherSubs.push(this.view.notification('preview@onload').subscribe(() => this.masonry.layout()));
    this.otherSubs.push(this.view.notification('order@onchange').subscribe(() => location.reload()));
    this.otherSubs.push(this.masonry.allDisplayed.subscribe(() => this.allDisplayed = true));

    this.route.queryParamMap.subscribe((params: ParamMap) => {
      this.view.init({ title: 'Image' });

      this.allDisplayed = false;
      this.page = params.has('page') ? Number(params.get('page')) : 0;
      this.andTags = params.has('andTags') ? params.get('andTags').split(',') : [];
      this.orTags = params.has('orTags') ? params.get('orTags').split(',') : [];
      this.notTags = params.has('notTags') ? params.get('notTags').split(',') : [];
      this.includeText = params.has('includeText') ? params.get('includeText').split(',') : [];
      this.excludeText = params.has('excludeText') ? params.get('excludeText').split(',') : [];

      this.imageService.search({
        andTags: this.andTags,
        orTags: this.orTags,
        notTags: this.notTags,
        includeText: this.includeText,
        excludeText: this.excludeText,
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
    private orderService: OrderService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

}
