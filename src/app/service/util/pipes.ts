import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'domain'})
export class DomainPipe implements PipeTransform {
  transform(url: string) {
    if (!url) { return url; }
    const match = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i);
    if (match != null && match.length > 2 && typeof match[2] === 'string' && match[2].length > 0) {
      return match[2];
    } else {
      return url;
    }
  }
}

@Pipe({name: 'limit'})
export class LimitPipe implements PipeTransform {
  transform(text: string, length: number) {
    return text.length <= length ? text : (text.substr(0, length) + '...');
  }
}

