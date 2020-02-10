import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {TypeInfo, TypeService} from '../../../service/util/type.service';
import {Preference} from '../../../service/util/preference.service';

@Component({
  selector: 'app-add-menu',
  templateUrl: './add-menu.component.html',
  styles: ['.menu-select { font-weight: bold; }']
})
export class AddMenuComponent {

  types: TypeInfo[] = TypeService.typeInfos;

  addFromURL() {
    const url = prompt('Please enter the URL: ');
    if (url) {
      this.router.navigate(['/node/new/outside'], {queryParams: {url}});
    }
  }

  constructor(
    public preference: Preference,
    private router: Router,
  ) {}
}
