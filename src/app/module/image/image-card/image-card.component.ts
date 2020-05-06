import {Component, Input} from '@angular/core';
import {ViewService} from '../../../system/service/util/view.service';
import {Image} from '../image';

@Component({
  selector: 'app-image-card',
  templateUrl: './image-card.component.html',
  styleUrls: ['./image-card.component.css']
})
export class ImageCardComponent {

  @Input() image: Image;
  loading = true;
  error = false;

  onload(error: boolean) {
    this.loading = false;
    this.error = error;
    this.view.notify('preview@onload');
  }

  constructor(
    public view: ViewService,
  ) { }

}
