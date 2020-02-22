import {Observable} from 'rxjs';
import {ExtraData, ListItem} from '../../../service/util/node';

export interface ExtraEdit {
  valid?: Observable<boolean>;
  setExtraData?(extraData: ExtraData);
  setExtraList?(extraList: ListItem[]);
  getExtraData?(): ExtraData;
  getExtraList?(): ListItem[];
}
