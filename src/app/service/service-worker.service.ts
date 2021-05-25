import {Injectable} from '@angular/core';
import {ViewService} from './view.service';
import {SwUpdate} from '@angular/service-worker';

@Injectable()
export class ServiceWorkerService {

  constructor(
    public view: ViewService,
    private updates: SwUpdate,
  ) {
    updates.available.subscribe(event => {
      this.view.alert(`New available version: hash#${event.available.hash}`, 'Update')
        .onAction()
        .subscribe(() => updates.activateUpdate().then(() => document.location.reload()));
    });
    updates.activated.subscribe(event => {
      this.view.alert(`New version hash#${event.current.hash} is activated`, 'OK');
    });
    navigator.serviceWorker.addEventListener('message', event => view.notify('service-worker@message', event));
  }

}
