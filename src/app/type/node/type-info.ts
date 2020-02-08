import {NodeContentComponent} from './content/node-content.component';
import {TypeInfo} from '../../service/util/type.service';

export const NodeType: TypeInfo = {
  id: 'node',
  name: 'Simple Node',
  preview: NodeContentComponent,
  detail: NodeContentComponent,
  icon: 'insert_drive_file',
};
