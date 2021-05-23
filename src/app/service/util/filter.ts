export class Condition {
  column: string;
  oper: string;
  value: any;
}

export class Sort {
  property: string;
  direction: string;
}

export class Tag {
  strict?: boolean;
  value?: string;
  id?: number;
  type?: string;
}

export class Filter {
  cascade?: boolean;
  part?: boolean;
  collection?: boolean;
  types?: string[];

  conditions?: Condition[];
  sorts?: Sort[];
  permission?: string;

  nsfw?: boolean;
  like?: boolean;
  hide?: boolean;

  andTags?: Tag[];
  orTags?: Tag[];
  notTags?: Tag[];

  andWords?: string[];
  orWords?: string[];
  notWords?: string[];
}
