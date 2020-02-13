import {Component, OnInit, ViewChild} from '@angular/core';
import {ViewService} from '../../service/util/view.service';
import {NodeService} from '../../service/node.service';
import {ActivatedRoute, Router, UrlSegment} from '@angular/router';
import {Filter} from '../../service/util/filter';
import {NodeMasonryComponent} from '../../component/node-masonry/node-masonry.component';
import {TypeInfo, TypeService} from '../../service/util/type.service';

@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.css']
})
export class UserHomeComponent implements OnInit {

  private defaultPath = 'favorite';
  private defaultData = null;

  types: TypeInfo[] = TypeService.typeInfos.map(i => i).reverse();

  isHome: boolean;
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

      this.isHome = this.path === 'home';
      if (this.isHome) {
        this.path = this.defaultPath;
        this.data = this.defaultData;
      } else {
        if (!this.defaultData && this.path === this.defaultPath) {
          history.replaceState(null, null, 'home');
        }
      }

      switch (this.path) {

        case 'home':
          this.router.navigate(['/favorite']);

        // tslint:disable-next-line:no-switch-case-fall-through
        case 'favorite':
          this.init({
            title: 'Favorite',
            filter: {conditions: [{column: 'node_like', oper: '=', value: 1}]},
          });
          break;

        case 'all':
          this.init({title: 'All'});
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
    private router: Router,
    private route: ActivatedRoute,
  ) { }

}
