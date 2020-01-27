export class MainData {
    id?: number;
    user?: number;
    type?: string;
    ctime?: number;
    mtime?: number;
    title?: string;
    excerpt?: string;
    linkForward?: number;
    linkBack?: number;
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
}

export class ListItem {
    node: Node;
    status: string;
}

export class Node {
    mainData: MainData;
    extraData: ExtraData;
    extraList: ListItem[];
}
