import {Component, Input, OnChanges, SimpleChanges, ViewChild, ViewContainerRef} from '@angular/core';
import {ExtraData, ListItem} from '../../service/node.service';
import {TypeService} from '../../service/util/type.service';
import {ExtraEdit} from './extra-edit';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-extra-data-edit',
  templateUrl: './extra-edit.component.html',
  styleUrls: ['./extra-edit.component.css']
})
export class ExtraEditComponent implements OnChanges {

  @Input() type: string;
  public valid: boolean;

  @ViewChild('content', { read: ViewContainerRef, static: true }) contentHost: ViewContainerRef;
  content: ExtraEdit;
  subscription: Subscription;

  private extraData: ExtraData;
  private extraList: ListItem[];

  public setExtraData(extraData: ExtraData) {
    this.extraData = extraData;
  }
  public setExtraList(extraList: ListItem[]) {
    this.extraList = extraList;
  }
  public getExtraData(): ExtraData {
    return this.content.getExtraData ? this.content.getExtraData() : null;
  }
  public getExtraList(): ListItem[] {
    return this.content.getExtraList ? this.content.getExtraList() : null;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.content) { this.contentHost.remove(); }
    const factory = this.typeService.getExtraEditFactory(this.type);
    const componentRef = this.contentHost.createComponent(factory);
    this.content = (componentRef.instance as ExtraEdit);

    this.valid = this.content.valid;
    if (this.subscription) { this.subscription.unsubscribe(); }
    this.subscription = this.content.onChange(() => this.valid = this.content.valid);

    if (this.extraData) {
      if (this.content.setExtraData) { this.content.setExtraData(this.extraData); }
      this.extraData = null;
    }
    if (this.extraList) {
      if (this.content.setExtraList) { this.content.setExtraList(this.extraList); }
      this.extraList = null;
    }
  }

  constructor(
    private typeService: TypeService
  ) { }

}
