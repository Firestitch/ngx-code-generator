import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { FsApi } from '@firestitch/api';

import { Category } from '../../shared/interfaces';


@Injectable()
export class CategoryData {

  constructor(private _fsApi: FsApi) { }

  public create(data: Category = { id: null }): Category {
    data.class = data.class || 'task';
    return data;
  }

  public get(id, query = {}): Observable<any> {
    return this._fsApi.get(`categories/${id}`, query, { key: 'category' });
  }

  public gets(data = {}, config = {}): Observable<any> {
    return this._fsApi.request('GET', 'categories', data, Object.assign({ key: 'categories' }, config));
  }

  public put(data, config = {}): Observable<any> {
    return this._fsApi.put(`categories/${data.id}`, data, Object.assign({ key: 'category' }, config));
  }

  public post(data): Observable<any> {
    return this._fsApi.post('categories', data, { key: 'category' });
  }

  public delete(data): Observable<any> {
    return this._fsApi.delete(`categories/${data.id}`, data, { key: 'category' });
  }

  public save(data): Observable<any> {
    if (data.id) {
      return this.put(data);
    }
    return this.post(data);
  }

  public order(data): Observable<any> {
    return this._fsApi.put('categories/order', data, { key: null });
  }

}
