import {Subscription} from 'rxjs';
import {ExtraData, ListItem} from '../../../service/util/node';

export interface ExtraEdit {
  valid: boolean;
  onChange(next: () => void): Subscription;
  setExtraData?(extraData: ExtraData);
  setExtraList?(extraList: ListItem[]);
  getExtraData?(): ExtraData;
  getExtraList?(): ListItem[];
}
