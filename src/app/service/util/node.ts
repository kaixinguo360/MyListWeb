export class MainData {
  id?: number;
  user?: number;
  type?: string;
  ctime?: number;
  mtime?: number;
  title?: string;
  excerpt?: string;
  linkDelete?: boolean;
  linkVirtual?: boolean;
  permission?: string;
  nsfw?: boolean;
  like?: boolean;
  hide?: boolean;
  sourceUrl?: string;
  comment?: string;
}

export class ExtraData {
  type: string;
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
