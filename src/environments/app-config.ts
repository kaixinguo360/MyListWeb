import {Order} from '../app/service/util/order';

export const AppConfig = {
  apiUrl: 'http://localhost:8080/api/',
  columnWidth: 240,
  mobileWidth: 640,
  defaultOrder: Order.MTIME_DESC,
};
