import {Component} from '@angular/core';
import {of, Subscription} from 'rxjs';
import {ExtraEdit} from '../../../com/extra-edit/extra-edit';

@Component({template: ''})
export class NodeExtraEditComponent implements ExtraEdit {
  valid = true;
  onChange(next: () => void): Subscription { return of().subscribe(); }
}
