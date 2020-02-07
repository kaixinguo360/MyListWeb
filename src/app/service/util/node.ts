export class MainData {
  id?: number;
  user?: number;
  type?: string;
  ctime?: number;
  mtime?: number;
  title?: string;
  excerpt?: string;
  part?: boolean;
  collection?: boolean;
  permission?: string;
  nsfw?: boolean;
  like?: boolean;
  hide?: boolean;
  source?: string;
  description?: string;
  comment?: string;
}

export class ExtraData {
  nodeType: string;
}

export class ListItem<T extends ExtraData = ExtraData> {
  node?: Node<T>;
  status?: string;
}

export class Node<T extends ExtraData = ExtraData> {
  mainData: MainData;
  extraData?: T;
  extraList?: ListItem[];
  tags?: Node[] | number[];
}
