import {Component, OnInit, ViewChild} from '@angular/core';
import {ViewService} from '../../service/util/view.service';
import {NodeService} from '../../service/node.service';
import {ActivatedRoute, UrlSegment} from '@angular/router';
import {Filter} from '../../service/util/filter';
import {NodeMasonryComponent} from '../../component/node-masonry/node-masonry.component';
import {TypeInfo, TypeService} from '../../service/util/type.service';

@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.css']
})
export class UserHomeComponent implements OnInit {

  types: TypeInfo[] = TypeService.typeInfos.map(i => i).reverse();

  path: string;
  data: string;
  showBackIcon = false;

  @ViewChild('masonry', {static: true}) masonry: NodeMasonryComponent;

  init(config: {title: string, fixed?: boolean, filter?: Filter}) {
    this.view.init({title: config.title});

    this.masonry.fixed = !!config.fixed;
    this.masonry.filter = config.filter;
    this.masonry.fetchData();
  }
  ngOnInit(): void {
    this.route.url.subscribe((urls: UrlSegment[]) => {
      this.path = urls[0].path;
      this.data = urls[1] ? urls[1].path : null;

      switch (this.path) {

        case 'home':
          this.init({title: 'Home'});
          break;

        case 'type':
          const type = this.typeService.getType(this.data);
          this.init({
            title: type.name,
            filter: {conditions: [{column: 'node_type', oper: '=', value: `'${type.id}'`}]},
          });
          break;

        case 'tag':
          const tagId = Number(this.data);
          this.init({
            title: `Tag - #${tagId}`,
            filter: {andTags: [{id: tagId}]},
          });
          this.nodeService.get(tagId).subscribe(node => this.view.setTitle(`Tag - ${node.mainData.title}`));
          break;

        case 'list':
          const listId = Number(this.data);
          this.init({
            title: `Collection - #${listId}`,
            fixed: true,
            filter: {andTags: [{id: listId}]},
          });
          this.nodeService.get(listId).subscribe(node => this.view.setTitle(node.mainData.title));
          break;

      }
    });
  }

  constructor(
    public view: ViewService,
    public typeService: TypeService,
    private nodeService: NodeService,
    private route: ActivatedRoute,
  ) { }

}
