import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'limit'})
export class LimitPipe implements PipeTransform {
  transform(text: string, length: number) {
    if (!text) { return text; }
    return text.length <= length ? text : (text.substr(0, length - 3) + '...');
  }
}

