import {Injectable} from '@angular/core';
import {HttpService} from '../../system/service/util/http.service';
import {Observable} from 'rxjs';
import {Image} from './image';
import {shareReplay, tap} from 'rxjs/operators';
import {ViewService} from '../../system/service/util/view.service';
import {Filter} from '../../system/component/widget/filter-input/filter-input.component';
import {OrderService} from '../../system/service/util/order.service';

export class ImageChangeEvent {
  added?: Image[];
  updated?: number[];
  deleted?: number[];
}

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  private static errorHandler = HttpService.errorHandler;
  public limit = 100;
  private cache = new Map<string, Observable<any>>();

  // ------------ Single Crud ------------ //
  public add(image: Image): Observable<Image> {
    return this.httpService.post<Image>('image', image).pipe(
      tap(n => this.handleChange({added: [n]})),
      ImageService.errorHandler,
    );
  }
  public get(id: number): Observable<Image> {
    const key = String(id);
    if (this.cache.has(key)) {
      return this.cache.get(key);
    } else {
      const ob = this.httpService.get<Image>('image/' + id, null).pipe(
        ImageService.errorHandler,
        shareReplay(1),
      );
      this.cache.set(key, ob);
      return ob;
    }
  }
  public update(image: Image): Observable<Image> {
    return this.httpService.put<Image>('image', image).pipe(
      tap(() => this.handleChange({updated: [image.id]})),
      ImageService.errorHandler,
    );
  }
  public delete(id: number): Observable<void> {
    return this.httpService.delete<void>('image/' + id, null).pipe(
      tap(() => this.handleChange({deleted: [id]})),
      ImageService.errorHandler,
    );
  }

  // ------------ Batch Crud ------------ //
  public batchAdd(images: Image[]): Observable<Image[]> {
    return this.httpService.post<Image[]>('image/batch', images).pipe(
      tap<Image[]>(s => this.handleChange({added: s})),
      ImageService.errorHandler,
    );
  }
  public batchGet(ids: number[]): Observable<Image[]> {
    return this.httpService.get<Image[]>(`image/batch?ids=${ids.join()}`).pipe(
      ImageService.errorHandler,
    );
  }
  public batchUpdate(images: Image[]): Observable<Image[]> {
    return this.httpService.put<Image[]>('image/batch', images).pipe(
      tap(() => this.handleChange({updated: images.map(n => n.id)})),
      ImageService.errorHandler,
    );
  }
  public batchDelete(ids: number[]): Observable<void> {
    return this.httpService.delete<void>('image/batch', ids).pipe(
      tap(() => this.handleChange({deleted: ids})),
      ImageService.errorHandler,
    );
  }

  // ------------ Search ------------ //
  public search(filter: Filter, page: number): Observable<Image[]> {
    return this.httpService.get<Image[]>('image', {
      andTags: filter.andTags == null ? '' : filter.andTags.join(),
      orTags: filter.orTags == null ? '' : filter.orTags.join(),
      notTags: filter.notTags == null ? '' : filter.notTags.join(),
      includeText: filter.includeText == null ? '' : filter.includeText.join(),
      excludeText: filter.excludeText == null ? '' : filter.excludeText.join(),
      limit: String(this.limit),
      offset: String(page * this.limit),
      order: this.orderService.getOrder('image'),
      direction: this.orderService.getDirection('image'),
    }).pipe(
      tap<Image[]>(s => this.handleChange({added: s})),
      ImageService.errorHandler,
    );
  }

  // ------------ Single Tag ------------ //
  public addTags(id: number, tags: string[]): Observable<void> {
    return this.httpService.post<void>(`image/${id}/tag`, tags).pipe(
      tap(() => this.handleChange({ updated: [id] })),
      ImageService.errorHandler,
    );
  }
  public getTags(id: number): Observable<string[]> {
    return this.httpService.get<string[]>(`image/${id}/tag`).pipe(
      ImageService.errorHandler,
    );
  }
  public setTags(id: number, tags: string[]): Observable<void> {
    return this.httpService.put<void>(`image/${id}/tag`, tags).pipe(
      tap(() => this.handleChange({ updated: [id] })),
      ImageService.errorHandler,
    );
  }
  public removeTags(id: number, tags: string[]): Observable<void> {
    return this.httpService.delete<void>(`image/${id}/tag`, tags).pipe(
      tap(() => this.handleChange({ updated: [id] })),
      ImageService.errorHandler,
    );
  }
  public clearTags(id: number): Observable<void> {
    return this.httpService.delete<void>(`image/${id}/tag/all`).pipe(
      tap(() => this.handleChange({ updated: [id] })),
      ImageService.errorHandler,
    );
  }

  // ------------ Batch Tag ------------ //
  public batchAddTags(ids: number[], tags: string[]): Observable<void> {
    return this.httpService.post<void>(`image/batch/tag?ids=${ids.join()}`, tags).pipe(
      tap(() => this.handleChange({ updated: ids })),
      ImageService.errorHandler,
    );
  }
  public batchGetTags(ids: number[]): Observable<string[][]> {
    return this.httpService.get<string[][]>(`image/batch/tag?ids=${ids.join()}`).pipe(
      ImageService.errorHandler,
    );
  }
  public batchSetTags(ids: number[], tags: string[]): Observable<void> {
    return this.httpService.put<void>(`image/batch/tag?ids=${ids.join()}`, tags).pipe(
      tap(() => this.handleChange({ updated: ids })),
      ImageService.errorHandler,
    );
  }
  public batchRemoveTags(ids: number[], tags: string[]): Observable<void> {
    return this.httpService.delete<void>(`image/batch/tag?ids=${ids.join()}`, tags).pipe(
      tap(() => this.handleChange({ updated: ids })),
      ImageService.errorHandler,
    );
  }
  public batchClearTags(ids: number[]): Observable<void> {
    return this.httpService.delete<void>(`image/batch/tag/all`).pipe(
      tap(() => this.handleChange({ updated: ids })),
      ImageService.errorHandler,
    );
  }

  // ------------ Utils ------------ //
  private handleChange(event: ImageChangeEvent) {
    this.cache.clear();
    this.view.notify('image@onchange', event);
  }

  constructor(
    public view: ViewService,
    private httpService: HttpService,
    private orderService: OrderService,
  ) { }
}
