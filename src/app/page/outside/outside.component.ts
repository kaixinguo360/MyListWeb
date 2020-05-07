import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {ProxyService} from '../../service/util/proxy.service';
import {ViewService} from '../../service/util/view.service';

@Component({
  selector: 'app-outside',
  templateUrl: './outside.component.html',
  styleUrls: ['./outside.component.css']
})
export class OutsideComponent implements OnInit {

  sourceUrl: string;
  private regex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;

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
        location.href = this.proxyService.proxyPage(this.sourceUrl);
      } else {
        this.view.alert('No URL found').afterDismissed().subscribe(() => this.view.back());
      }
    });
  }

  private getUrl(str: string): string[] {
    if (!str) { return []; }
    const result = str.match(this.regex);
    return result ? result : [];
  }

  constructor(
    public view: ViewService,
    private proxyService: ProxyService,
    private route: ActivatedRoute,
  ) { }

}
