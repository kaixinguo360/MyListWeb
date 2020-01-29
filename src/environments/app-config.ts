import {Order} from '../app/order';

export const AppConfig = {
  iNodeStore: 'INodeStore',
  apiUrl: 'http://localhost:8080/api/',
  columnWidth: 240,
  columnMargin: 4,
  mobileWidth: 640,
  defaultOrder: Order.MTIME_DESC,
  defaultMobileColumn: 2,
  defaultId: '0',
};

