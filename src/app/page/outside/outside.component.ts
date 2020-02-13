import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';

import {MasonryComponent} from '../../component/masonry/masonry.component';
import {Preference} from '../../service/util/preference.service';
import {ProxyService} from '../../service/util/proxy.service';
import {NodeService} from '../../service/node.service';
import {Node} from '../../service/util/node';
import {ViewService} from '../../service/util/view.service';
import {TypeService} from '../../service/util/type.service';
import {TagSelector} from '../../component/tag-dialog/tag-dialog.component';

@Component({
  selector: 'app-outside',
  templateUrl: './outside.component.html',
  styleUrls: ['./outside.component.css']
})
export class OutsideComponent implements OnInit {

  constructor(
    public view: ViewService,
    public preference: Preference,
    public tagSelector: TagSelector,
    private typeService: TypeService,
    private proxyService: ProxyService,
    private nodeService: NodeService,
    private route: ActivatedRoute,
    private router: Router,
    private domSanitizer: DomSanitizer,
  ) { }

  @ViewChild('masonryRef', {static: true}) masonry: MasonryComponent;

  sourceUrl: string;
  proxyUrl: SafeUrl;
  title: string;
  description: string;
  items: Node[];

  isLoading = true;
  isOpen = this.preference.getSwitch('outside@isOpen');

  private regex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;

  save() {
    const selected = this.masonry.getSelectedItems();

    const draft: Node = {
      mainData: {
        user: this.view.user.id,
        title: this.title,
        part: false,
        collection: false,
        permission: 'private',
        nsfw: false,
        like: false,
        hide: false,
        source: this.sourceUrl,
        description: this.description,
      }
    };

    if (selected.length === 0) {
      draft.mainData.type = 'node';
    } else if (selected.length === 1) {
      const node: Node = selected[0];
      draft.mainData.type = node.mainData.type;

      if (draft.mainData.title) {
        draft.mainData.description = node.mainData.description ? node.mainData.description : draft.mainData.description;
      } else {
        draft.mainData.title = node.mainData.description ? node.mainData.description : draft.mainData.title;
        if (draft.mainData.title && draft.mainData.title.length >= 100) {
          draft.mainData.description = draft.mainData.title;
          draft.mainData.title = draft.mainData.title.substr(0, 100);
        }
      }

      draft.extraData = node.extraData;
    } else {
      draft.mainData.type = 'list';
      draft.mainData.collection = true;
      draft.extraList = selected.map(node => ({node, status: 'new'}));
    }

    this.tagSelector.selectTags(
      null, null, `Selected ${selected.length} items`
    ).subscribe(tags => {
      if (tags) {
        draft.tags = tags;
        this.preference.set('node-edit@draft', JSON.stringify(draft));
        this.router.navigate(['/node/new']);
      }
    });
  }
  load() {
    const dataStr = localStorage.getItem('outside@data');
    if (dataStr) {
      const data: {title: string, images: {url: string, info: string}[]} = JSON.parse(dataStr);

      this.title = data.title ? data.title : this.title;
      if (this.title && this.title.length >= 100) {
        this.description = this.title;
        this.title = this.title.substr(0, 100);
      }

      this.items = data.images.filter(item => item.url).map(image => ({
        mainData: {
          user: this.view.user.id,
          type: 'image',
          title: '',
          part: true,
          collection: false,
          permission: 'private',
          nsfw: false,
          like: false,
          hide: false,
          source: this.sourceUrl,
          description: image.info,
        },
        extraData: {
          nodeType: 'image',
          url: image.url,
        },
      }));
      this.items.forEach(node => this.typeService.process(node));

      this.masonry.setItems(this.items);
      localStorage.removeItem('outside@data');
      this.isLoading = false;
    }
  }

  ngOnInit() {
    this.masonry.enableSelectMode(true);
    this.view.init({title: 'Outside'});
    this.view.notification('preview@onload').subscribe(() => this.masonry.layout());

    // Get URL From The Route
    this.route.queryParams.subscribe((params: Params) => {
      const title = params.title;
      const text = params.text;
      const url = params.url;

      let urls = [];
      urls = urls.concat(this.getUrl(title));
      urls = urls.concat(this.getUrl(text));
      urls = urls.concat(this.getUrl(url));

      if (urls.length === 0) {
        this.view.alert('No URL found').afterDismissed().subscribe(() => this.view.back());
      } else {
        this.sourceUrl = urls[0];
        this.title = title;
        if (this.sourceUrl) {
          const encodedUrl = this.proxyService.proxyPage(this.sourceUrl);
          this.proxyUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(encodedUrl);
        }
      }
    });

    // Add Event Listener For Storage
    window.addEventListener('storage', () => this.load());
  }
  private getUrl(str: string): string[] {
    if (!str) { return []; }
    const result = str.match(this.regex);
    return result ? result : [];
  }

}
