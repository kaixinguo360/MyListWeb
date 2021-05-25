import {NodeContentComponent} from './content/node-content.component';
import {TypeDefinition} from '../../service/type.service';

export const NodeType: TypeDefinition = {
  id: 'node',
  name: 'Simple Node',
  openInNewTab: false,
  preview: NodeContentComponent,
  detail: NodeContentComponent,
  icon: 'insert_drive_file',
};
