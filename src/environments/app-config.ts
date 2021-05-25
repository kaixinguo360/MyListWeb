import {Order} from '../app/service/order.service';

export const AppConfig = {
  apiUrl: '/api/',
  proxyUrl: '/proxy/',
  columnWidth: 240,
  mobileWidth: 640,
  defaultOrder: Order.CTIME_DESC,
};
