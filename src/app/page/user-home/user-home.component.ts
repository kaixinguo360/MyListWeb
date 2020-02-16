import {Component, OnInit, ViewChild} from '@angular/core';
import {ViewService} from '../../service/util/view.service';
import {NodeService} from '../../service/node.service';
import {ActivatedRoute, Router, UrlSegment} from '@angular/router';
import {Filter} from '../../service/util/filter';
import {NodeMasonryComponent} from '../../component/node-masonry/node-masonry.component';
import {TypeInfo, TypeService} from '../../service/util/type.service';
import {ClipboardService} from '../../service/util/clipboard.service';
import {Node} from '../../service/util/node';

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
  mainNode: Node;
  showBackIcon = false;

  @ViewChild('masonry', {static: true}) masonry: NodeMasonryComponent;

  back() {
    if (this.mainNode) {
      this.view.back();
    } else {
      this.router.navigate(['/home']);
    }
  }
  init(config: {title: string, fixed?: boolean, filter?: Filter}) {
    this.view.init({title: config.title});
    this.mainNode = null;

    this.masonry.filterFixed = !!config.fixed;
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

        case 'favorite':
          this.init({
            title: 'Favorite',
            filter: {conditions: [{column: 'node_like', oper: '=', value: 1}]},
          });
          break;

        case 'all':
          this.init({title: 'All'});
          break;

        case 'untagged':
          this.view.init({title: 'Untagged'});
          this.mainNode = null;
          this.nodeService.getAllByType('tag').subscribe(node => {
            this.masonry.filter = {
              conditions: [{column: 'node_type', oper: '!=', value: '\'tag\''}],
              notTags: node.map(i => ({id: i.mainData.id})),
            };
            this.masonry.fetchData();
          });
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
          this.nodeService.get(tagId).subscribe(node => {
            this.mainNode = node;
            this.view.setTitle(`Tag - ${node.mainData.title}`);
          });
          break;

        case 'list':
          const listId = Number(this.data);
          this.init({
            title: `Collection - #${listId}`,
            fixed: true,
            filter: {andTags: [{id: listId}]},
          });
          this.nodeService.get(listId).subscribe(node => {
            this.mainNode = node;
            this.view.setTitle(node.mainData.title);
          });
          break;

      }
    });
  }

  constructor(
    public view: ViewService,
    public clipboard: ClipboardService,
    public typeService: TypeService,
    private nodeService: NodeService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

}
