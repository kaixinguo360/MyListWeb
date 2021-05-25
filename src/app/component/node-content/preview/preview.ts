import {Node} from '../../../service/node.service';

export interface Preview {
  node: Node;
  lazyload?: boolean;
}
