import {Injectable} from '@angular/core';
import {AppConfig} from '../../../environments/app-config';
import {Preference} from './preference.service';

@Injectable({
  providedIn: 'root'
})
export class ProxyService {

  public static base64url(input) {
    return btoa(encodeURI(input))
      .replace(/-/g, '+')
      .replace(/_/g, '/');
  }

  public proxy(url: string): string {
    if (!url) {
      return '';
    }
    const proxyMode = this.preference.get('proxy_mode', 'http');
    const proxy = AppConfig.proxyUrl + 'static/' + ProxyService.base64url(url);
    switch (proxyMode) {
      case 'all': return proxy;
      case 'http': return (url.substr(0, 7) === 'http://') ? proxy : url;
      case 'none': default: return url;
    }
  }

  public proxyPage(url: string): string {
    return AppConfig.proxyUrl + 'page/' + ProxyService.base64url(url);
  }

  constructor(
    public preference: Preference,
  ) { }
}
