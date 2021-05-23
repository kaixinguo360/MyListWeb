import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {ViewService} from '../../service/util/view.service';
import {ProxyService} from '../../service/util/proxy.service';
import {Node} from '../../service/util/node';

@Component({
  selector: 'app-save',
  templateUrl: './save.component.html',
  styleUrls: ['./save.component.css']
})
export class SaveComponent implements OnInit {

  ngOnInit() {
    this.view.init({title: 'Save'});

    // Get draft From The Route
    this.route.queryParams.subscribe((params: Params) => {
      const draft: Node = JSON.parse(params.draft);
      if (draft.mainData) {
        draft.mainData.user = this.view.user.id;
      }
      if (draft.extraList) {
        draft.extraList.filter(i => i.node.mainData.user = this.view.user.id);
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
