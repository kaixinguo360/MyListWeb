import {Injectable} from '@angular/core';
import {AppConfig} from '../../../environments/app-config';
import {Preference} from './preference.service';
import {ViewService} from './view.service';

@Injectable({
  providedIn: 'root'
})
export class ProxyService {

  public mode = this.preference.get('proxy-service@mode', 'http');

  public static base64url(input) {
    return btoa(encodeURI(input))
      .replace(/-/g, '+')
      .replace(/_/g, '/');
  }

  public proxy(url: string): string {
    if (!url) {
      return '';
    }
    const proxy = AppConfig.proxyUrl + 'static/' + ProxyService.base64url(url);
    switch (this.mode) {
      case 'all': return proxy;
      case 'http': return (url.substr(0, 7) === 'http://') ? proxy : url;
      case 'none': default: return url;
    }
  }
  public proxyPage(url: string): string {
    return AppConfig.proxyUrl + 'page/' + ProxyService.base64url(url);
  }
  public changeMode(mode: string) {
    this.preference.set('proxy-service@mode', mode);
    this.mode = mode;
    this.view.detectChanges();
  }

  constructor(
    public preference: Preference,
    private view: ViewService,
  ) { }
}
