import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpService} from './util/http.service';

export class User {
  id?: number;
  name?: string;
  pass?: string;
  email?: string;
  status?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private errorHandler = HttpService.errorHandler;

  public add(user: User): Observable<User> {
    return this.httpService.post<User>('user', user, true).pipe(this.errorHandler);
  }
  public get(id: number): Observable<User> {
    return this.httpService.get<User>('user/' + id, null, true).pipe(this.errorHandler);
  }
  public getAll(): Observable<User[]> {
    return this.httpService.get<User[]>('user', null, true).pipe(this.errorHandler);
  }
  public update(user: User): Observable<User> {
    return this.httpService.put<User>('user', user, true).pipe(this.errorHandler);
  }
  public remove(id: number): Observable<void> {
    return this.httpService.delete<void>('user/' + id, null, true).pipe(this.errorHandler);
  }

  constructor(
    private httpService: HttpService,
  ) { }
}
