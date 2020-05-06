import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ViewService} from '../../../system/service/util/view.service';
import {ImageService} from '../image.service';
import {Image} from '../image';
import {MasonryComponent} from '../../../system/component/masonry/masonry.component';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-image-search',
  templateUrl: './image-search.component.html',
  styleUrls: ['./image-search.component.css']
})
export class ImageSearchComponent implements OnInit, OnDestroy {

  otherSubs: Subscription[] = [];
  @ViewChild('masonryRef', { read: MasonryComponent, static: true }) masonry: MasonryComponent;

  onload(error: boolean) {
    this.view.notify('preview@onload');
  }

  ngOnInit(): void {
    this.view.init({ title: 'Image' });
    this.otherSubs.push(this.view.notification('preview@onload').subscribe(() => this.masonry.layout()));
    this.imageService.search({}).subscribe(
      images => this.masonry.setItems(images)
    );
  }
  ngOnDestroy(): void {
    this.otherSubs.forEach(sub => sub.unsubscribe());
  }

  constructor(
    public view: ViewService,
    private imageService: ImageService,
  ) { }

}
