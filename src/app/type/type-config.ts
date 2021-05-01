import {NodeType} from './node/type-info';
import {ListType} from './list/type-info';
import {CollectionType} from './collection/type-info';
import {TagType} from './tag/type-info';
import {ImageType} from './image/type-info';
import {VideoType} from './video/type-info';
import {TypeInfo} from '../service/util/type.service';

export const DefaultType = NodeType;
export const TypeConfig: TypeInfo[] = [
  NodeType,
  ImageType,
  VideoType,
  ListType,
  CollectionType,
  TagType,
];
