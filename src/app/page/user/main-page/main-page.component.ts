import {Component, OnInit, ViewChild} from '@angular/core';
import {ViewService} from '../../../service/view.service';
import {Filter, NodeService} from '../../../service/node.service';
import {ActivatedRoute, Router, UrlSegment} from '@angular/router';
import {NodeMasonryComponent} from '../../../component/node-masonry/node-masonry.component';
import {TypeDefinition, TypeService} from '../../../service/type.service';
import {ClipboardService} from '../../../service/clipboard.service';

@Component({
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {

  private defaultPath = 'favorite';
  private defaultData = null;
  types: TypeDefinition[] = TypeService.typeInfos.map(i => i).reverse();

  isHome: boolean;
  path: string;
  data: string;
  showBackIcon = false;

  @ViewChild('masonry', {static: true}) masonry: NodeMasonryComponent;

  init(config: {title: string, fixed?: boolean, filter?: Filter}) {
    this.view.init({title: config.title});

    this.masonry.mainNode = null;
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
            filter: {like: true},
          });
          break;

        case 'all':
          this.init({title: 'All'});
          break;

        case 'untagged':
          this.view.init({title: 'Untagged'});
          this.masonry.mainNode = null;
          this.nodeService.getAllByType('tag').subscribe(node => {
            this.masonry.filter = {
              conditions: [{column: 'content.node_type', oper: '!=', value: '\'tag\''}],
              notTags: node.map(i => ({id: i.mainData.id})),
            };
            this.masonry.fetchData();
          });
          break;

        case 'type':
          const type = this.typeService.getType(this.data);
          this.init({
            title: type.name,
            filter: {types: [type.id]},
          });
          break;

        case 'tag':
          const tagId = Number(this.data);
          this.init({
            title: `Tag - #${tagId}`,
            filter: {andTags: [{id: tagId}]},
          });
          this.nodeService.get(tagId).subscribe(node => {
            this.masonry.mainNode = node;
            this.view.setTitle(`Tag - ${node.mainData.title}`);
          });
          break;

        case 'list':
          const listId = Number(this.data);
          this.init({
            title: `List - #${listId}`,
            filter: {andTags: [{id: listId}]},
          });
          this.nodeService.get(listId).subscribe(node => {
            this.masonry.mainNode = node;
            this.view.setTitle(node.mainData.title);
          });
          break;

        case 'collection':
          const collectionId = Number(this.data);
          this.init({
            title: `Collection - #${collectionId}`,
            fixed: true,
            filter: {andTags: [{id: collectionId}]},
          });
          this.nodeService.get(collectionId).subscribe(node => {
            this.masonry.mainNode = node;
            this.view.setTitle(node.mainData.title);
          });
          break;

        case 'dlist':
          const dlistId = Number(this.data);
          this.view.setTitle(`DList - #${dlistId}`);
          this.nodeService.get(dlistId).subscribe(node => {
            this.init({
              title: node.mainData.title,
              filter: JSON.parse((node.extraData as any).filter),
            });
            this.masonry.mainNode = node;
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
