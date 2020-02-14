import {Injectable} from '@angular/core';
import {ViewService} from './view.service';
import {Node} from './node';

@Injectable({
  providedIn: 'root'
})
export class ClipboardService {

  private nodes: Node[] = [];
  public length = 0;

  public set(nodes: Node[]) {
    if (nodes && nodes.length) {
      this.nodes = nodes;
      this.length = nodes.length;
    } else {
      this.nodes = [];
      this.length = 0;
    }
  }
  public get(): Node[] {
    return this.length ? this.nodes : [];
  }
  public clear() {
    this.nodes = [];
    this.length = 0;
  }

  constructor(
    public view: ViewService
  ) {
    view.notification('node@onchange').subscribe(() => this.clear());
  }

}
