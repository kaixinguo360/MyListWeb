import {Order} from '../app/service/util/order';

export const AppConfig = {
  apiUrl: '/api/',
  proxyUrl: '/proxy/',
  columnWidth: 240,
  mobileWidth: 640,
  defaultOrder: Order.MTIME_DESC,
};
