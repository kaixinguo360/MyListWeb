import {Injectable} from '@angular/core';
import {HttpService} from './util/http.service';
import {Observable} from 'rxjs';
import {shareReplay, tap} from 'rxjs/operators';
import {ViewService} from './util/view.service';

export class Tag {
  id?: number;
  user?: number;

  ctime?: number;
  mtime?: number;

  name: string;
  description?: string;
}

export class TagChangeEvent {
  added?: Tag[];
  updated?: number[];
  deleted?: number[];
}

@Injectable({
  providedIn: 'root'
})
export class TagService {

  private static errorHandler = HttpService.errorHandler;
  private cache = new Map<string, Observable<any>>();

  // ------------ Single Crud ------------ //
  public add(tag: Tag): Observable<Tag> {
    return this.httpService.post<Tag>('tag', tag).pipe(
      tap(n => this.handleChange({added: [n]})),
      TagService.errorHandler,
    );
  }
  public get(id: number): Observable<Tag> {
    const key = String(id);
    if (this.cache.has(key)) {
      return this.cache.get(key);
    } else {
      const ob = this.httpService.get<Tag>('tag/' + id, null).pipe(
        TagService.errorHandler,
        shareReplay(1),
      );
      this.cache.set(key, ob);
      return ob;
    }
  }
  public update(tag: Tag): Observable<Tag> {
    return this.httpService.put<Tag>('tag', tag).pipe(
      tap(() => this.handleChange({updated: [tag.id]})),
      TagService.errorHandler,
    );
  }
  public delete(id: number): Observable<void> {
    return this.httpService.delete<void>('tag/' + id, null).pipe(
      tap(() => this.handleChange({deleted: [id]})),
      TagService.errorHandler,
    );
  }

  // ------------ Batch Crud ------------ //
  public batchAdd(tags: Tag[]): Observable<Tag[]> {
    return this.httpService.post<Tag[]>('tag/batch', tags).pipe(
      tap<Tag[]>(s => this.handleChange({added: s})),
      TagService.errorHandler,
    );
  }
  public batchGet(ids: number[]): Observable<Tag[]> {
    return this.httpService.get<Tag[]>(`tag/batch?ids=${ids.join()}`).pipe(
      TagService.errorHandler,
    );
  }
  public batchUpdate(tags: Tag[]): Observable<Tag[]> {
    return this.httpService.put<Tag[]>('tag/batch', tags).pipe(
      tap(() => this.handleChange({updated: tags.map(n => n.id)})),
      TagService.errorHandler,
    );
  }
  public batchDelete(ids: number[]): Observable<void> {
    return this.httpService.delete<void>('tag/batch', ids).pipe(
      tap(() => this.handleChange({deleted: ids})),
      TagService.errorHandler,
    );
  }

  // ------------ Search ------------ //
  public search(config: {
    includeText?: string[],
    excludeText?: string[],
    limit?: number,
    offset?: number,
  } = {}): Observable<Tag[]> {
    return this.httpService.get<Tag[]>('tag', {
      includeText: config.includeText == null ? '' : config.includeText.join(),
      excludeText: config.excludeText == null ? '' : config.excludeText.join(),
      limit: config.limit == null ? '' : config.limit + '',
      offset: config.offset == null ? '' : config.offset + '',
    }).pipe(
      tap<Tag[]>(s => this.handleChange({added: s})),
      TagService.errorHandler,
    );
  }

  // ------------ Utils ------------ //
  private handleChange(event: TagChangeEvent) {
    this.cache.clear();
    this.view.notify('tag@onchange', event);
  }

  constructor(
    public view: ViewService,
    private httpService: HttpService,
  ) { }
}
