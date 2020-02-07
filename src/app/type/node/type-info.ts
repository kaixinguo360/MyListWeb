import {NodeContentComponent} from './content/node-content.component';
import {NodeExtraEditComponent} from './extra-edit/node-extra-edit.component';
import {TypeInfo} from '../../service/util/type.service';

export const NodeType: TypeInfo = {
  id: 'node',
  name: 'Simple Node',
  preview: NodeContentComponent,
  detail: NodeContentComponent,
  extraEdit: NodeExtraEditComponent,
  icon: 'insert_drive_file',
};
