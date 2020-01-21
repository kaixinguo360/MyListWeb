import {ContentDetail} from './content-detail';

export interface ContentPreview extends ContentDetail {
    width: number;
    height: number;
    maxWidth: number;
    maxHeight: number;
}
