import {ExtraData, ListItem, Node} from '../../service/node.service';
import {Subscription} from 'rxjs';

export interface ExtraEdit {
  valid: boolean;
  onChange(next: () => void): Subscription;
  setExtraData?(extraData: ExtraData);
  setExtraList?(extraList: ListItem[]);
  getExtraData?(): ExtraData;
  getExtraList?(): ListItem[];
  process?(node: Node);
}
