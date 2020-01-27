import {Component, OnInit} from '@angular/core';
import {ViewService} from '../../../service/util/view.service';

@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.css']
})
export class UserHomeComponent implements OnInit {

  constructor(
    private viewService: ViewService,
  ) {
    this.viewService.init('User Home');
  }

  ngOnInit() {
  }

}
