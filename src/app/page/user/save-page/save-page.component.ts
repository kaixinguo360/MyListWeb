import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {ViewService} from '../../../service/view.service';
import {ProxyService} from '../../../service/proxy.service';
import {Node} from '../../../service/node.service';

@Component({
  templateUrl: './save-page.component.html',
  styleUrls: ['./save-page.component.css']
})
export class SavePageComponent implements OnInit {

  ngOnInit() {
    this.view.init({title: 'Save'});

    // Get draft From The Route
    this.route.queryParams.subscribe((params: Params) => {
      const draft: Node = JSON.parse(params.draft);
      if (draft.mainData) {
        draft.mainData.user = this.view.user.id;
      }
      if (draft.extraList) {
        draft.extraList.forEach(i => i.node.mainData.user = this.view.user.id);
      }
      localStorage.setItem('node-edit@draft', JSON.stringify(draft));
      location.href = location.origin + '/node/new?draft=1';
    });
  }

  constructor(
    public view: ViewService,
    private proxyService: ProxyService,
    private route: ActivatedRoute,
  ) { }

}
