import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {TypeDefinition, TypeService} from '../../../service/type.service';
import {Preference} from '../../../service/preference.service';

@Component({
  selector: 'app-add-menu',
  templateUrl: './add-menu.component.html',
  styles: ['.menu-select { font-weight: bold; }']
})
export class AddMenuComponent {

  types: TypeDefinition[] = TypeService.typeInfos;

  addFromURL() {
    const url = prompt('Please enter the URL: ');
    if (url) {
      this.router.navigate(['/outside'], {queryParams: {url}});
    }
  }

  constructor(
    public preference: Preference,
    private router: Router,
  ) {}
}
