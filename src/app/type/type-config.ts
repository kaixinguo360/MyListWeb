import {NodeType} from './node/type-info';
import {ListType} from './list/type-info';
import {CollectionType} from './collection/type-info';
import {TagType} from './tag/type-info';
import {ImageType} from './image/type-info';
import {VideoType} from './video/type-info';
import {DListType} from './dlist/type-info';
import {TypeDefinition} from '../service/type.service';

export const DefaultType = NodeType;
export const TypeConfig: TypeDefinition[] = [
  NodeType,
  ImageType,
  VideoType,
  ListType,
  CollectionType,
  TagType,
  DListType,
];
