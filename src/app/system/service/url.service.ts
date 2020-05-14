import {Injectable} from '@angular/core';
import {ParamMap, Params, Router} from '@angular/router';
import {Filter} from '../component/widget/filter-input/filter-input.component';

@Injectable({
  providedIn: 'root'
})
export class UrlService {

  public getFilter(params: ParamMap): Filter {
    return {
      andTags: params.get('andTags') ? params.get('andTags').split(',') : [],
      orTags: params.get('orTags') ? params.get('orTags').split(',') : [],
      notTags: params.get('notTags') ? params.get('notTags').split(',') : [],
      includeText: params.get('includeText') ? params.get('includeText').split(',') : [],
      excludeText: params.get('excludeText') ? params.get('excludeText').split(',') : [],
    };
  }

  public getPage(params: ParamMap): number {
    return params.get('page') ? Number(params.get('page')) : 0;
  }

  public getParam(filter: Filter, page: number): Params {
    return {
      andTags: filter.andTags.join(),
      orTags: filter.orTags.join(),
      notTags: filter.notTags.join(),
      includeText: filter.includeText.join(),
      excludeText: filter.excludeText.join(),
      page,
    };
  }

  public jump(path: string, filter: Filter, page: number) {
    this.router.navigate([path], {
      queryParams: this.getParam(filter, page)
    });
  }

  constructor(
    private router: Router,
  ) {
  }

}
