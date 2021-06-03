import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {ProxyService} from '../../../service/proxy.service';
import {ViewService} from '../../../service/view.service';
import {Preference} from '../../../service/preference.service';
import {Node, NodeService} from '../../../service/node.service';
import {catchError, tap} from 'rxjs/operators';
import {of} from 'rxjs';

@Component({
  templateUrl: './outside-page.component.html',
  styleUrls: ['./outside-page.component.css']
})
export class OutsidePageComponent implements OnInit {

  title: string;
  sourceUrl: string;

  checking = true;
  saved = false;
  savedNodes: Node[];

  private regex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;

  saveDraft() {
    const draft: Node = {
      mainData: {
        type: 'node',
        user: this.view.user.id,
        title: this.title,
        source: this.sourceUrl,
      },
      tags: [],
    };
    this.preference.set('node-edit@draft', JSON.stringify(draft));
    location.href = location.origin + '/node/new?draft=1';
  }

  ngOnInit() {
    this.view.init({title: 'Outside'});

    // Get URL From The Route
    this.route.queryParams.subscribe((params: Params) => {
      const title = params.title;
      const text = params.text;
      const url = params.url;

      let urls = [];
      urls = urls.concat(this.getUrl(title));
      urls = urls.concat(this.getUrl(text));
      urls = urls.concat(this.getUrl(url));

      if (urls.length >= 0 && urls[0]) {
        this.sourceUrl = urls[0];
      } else {
        this.sourceUrl = url ? url : (text ? text : title);
      }

      if (this.sourceUrl) {
        if (!this.sourceUrl.startsWith('http://') && !this.sourceUrl.startsWith('https://')) {
          this.sourceUrl = 'https://' + this.sourceUrl;
        }
        this.title = title ? title : this.getDomain(this.sourceUrl);

        // Check if this url added
        this.nodeService.getAll({
          orKeywords: [this.sourceUrl]
        }).pipe(
          tap((nodes) => {
            this.checking = false;
            if (nodes && nodes.length > 0) {
              this.saved = true;
              this.savedNodes = nodes;
            } else {
              this.jump();
            }
          }),
          catchError((e) => {
            this.checking = false;
            return of(e);
          }),
        ).subscribe();
      } else {
        this.view.alert('No URL found').afterDismissed().subscribe(() => this.view.back());
      }
    });
  }
  jump() {
    location.href = this.proxyService.proxyPage(this.sourceUrl);
  }

  private getUrl(str: string): string[] {
    if (!str) { return []; }
    const result = str.match(this.regex);
    return result ? result : [];
  }
  private getDomain(url: string): string {
    if (!url) { return url; }
    const match = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i);
    if (match != null && match.length > 2 && typeof match[2] === 'string' && match[2].length > 0) {
      return match[2];
    } else {
      return url;
    }
  }

  constructor(
    public view: ViewService,
    private proxyService: ProxyService,
    private nodeService: NodeService,
    private preference: Preference,
    private route: ActivatedRoute,
  ) { }

}
