import {Component, Input, OnChanges, SimpleChanges, ViewChild, ViewContainerRef} from '@angular/core';
import {ExtraEdit} from './extra-edit';
import {BehaviorSubject, Subject, Subscription} from 'rxjs';
import {TypeService} from '../../../service/type.service';
import {ExtraData, ListItem} from '../../../service/node.service';

@Component({
  selector: 'app-extra-edit',
  templateUrl: './extra-edit.component.html',
  styleUrls: ['./extra-edit.component.css']
})
export class ExtraEditComponent implements OnChanges, ExtraEdit {

  @Input() type: string;

  @ViewChild('content', { read: ViewContainerRef, static: true }) contentHost: ViewContainerRef;
  content: ExtraEdit;
  valid: Subject<boolean> = new BehaviorSubject<boolean>(true);
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
    return (this.content && this.content.getExtraData) ? this.content.getExtraData() : null;
  }
  public getExtraList(): ListItem[] {
    return (this.content && this.content.getExtraList) ? this.content.getExtraList() : null;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.content) {
      this.contentHost.remove();
      this.content = null;
    }
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }

    const factory = this.typeService.getExtraEditFactory(this.type);
    if (factory) {
      const componentRef = this.contentHost.createComponent(factory);
      this.content = (componentRef.instance as ExtraEdit);

      if (this.content.valid) {
        this.subscription = this.content.valid.subscribe(valid => this.valid.next(valid));
      } else {
        this.valid.next(true);
      }
      if (this.extraData) {
        if (this.content.setExtraData) { this.content.setExtraData(this.extraData); }
        this.extraData = null;
      }
      if (this.extraList) {
        if (this.content.setExtraList) { this.content.setExtraList(this.extraList); }
        this.extraList = null;
      }
    } else {
      this.valid.next(true);
    }
  }

  constructor(
    private typeService: TypeService
  ) { }


}
