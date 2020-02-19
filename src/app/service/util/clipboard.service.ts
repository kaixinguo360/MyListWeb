import {Injectable} from '@angular/core';
import {ViewService} from './view.service';
import {Node} from './node';
import {NodeChangeEvent} from '../node.service';

@Injectable({
  providedIn: 'root'
})
export class ClipboardService {

  private nodes: Node[] = [];
  public length = 0;
  public isCollection = false;
  public fixed = false;

  public get(): Node[] {
    return this.length ? this.nodes : [];
  }
  public set(nodes: Node[], showStatus = true) {
    if (nodes && nodes.length) {
      this.nodes = nodes;
    } else {
      this.nodes = [];
    }
    this.updateStatus();
    if (showStatus) { this.showStatus(); }
  }
  public add(nodes: Node[], showStatus = true) {
    if (this.nodes && this.nodes.length) {
      const newNodes = nodes.filter(node => !this.nodes.find(n => n.mainData.id === node.mainData.id));
      this.nodes = this.nodes.concat(newNodes);
    } else {
      this.nodes = nodes;
    }

    if (showStatus) {
      const added = this.nodes.length - this.length;
      this.view.alert( `${
        added > 1 ? `${nodes.length} new items` : `${added ? 'One' : 'No'} new item`
      } add to clipboard.`)
        .afterDismissed().subscribe(() => this.showStatus());
    }

    this.updateStatus();
  }
  public remove(nodes: Node[], showStatus = true) {
    if (this.nodes && this.nodes.length) {
      this.nodes = this.nodes.filter(node => !nodes.find(n => n.mainData.id === node.mainData.id));
    }

    if (showStatus) {
      const removed = this.length - this.nodes.length;
      this.view.alert( `${
        removed > 1 ? `${nodes.length} items` : `${removed ? 'One' : 'No'} item`
      } removed from clipboard.`)
        .afterDismissed().subscribe(() => this.showStatus());
    }

    this.updateStatus();
  }
  public clear(showStatus = true) {
    this.nodes = [];
    this.updateStatus();
    if (showStatus) { this.showStatus(); }
  }

  public setFixed(fixed: boolean) {
    this.fixed = fixed;
  }

  private updateStatus() {
    this.length = this.nodes.length;
    this.isCollection = this.length === 1 && (
      this.nodes[0].mainData.type === 'list' || this.nodes[0].mainData.type === 'tag'
    );
  }
  private showStatus() {
    this.view.alert(
      this.nodes.length ?
        `Clipboard now has ${this.nodes.length === 1 ? `one item` : `${this.nodes.length} items`}` :
        'Clipboard now is empty'
    );
  }

  constructor(
    public view: ViewService
  ) {
    view.notification('node@onchange').subscribe((event: NodeChangeEvent) => {
      if (!this.fixed) {
        this.clear(false);
      } else {
        if (event.deleted) {
          this.nodes = this.nodes.filter(n => event.deleted.indexOf(n.mainData.id) < 0);
          this.updateStatus();
        }
      }
    });
  }

}
