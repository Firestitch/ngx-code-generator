import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { FsApi } from '@firestitch/api';

import { Type } from '../../shared/interfaces';


@Injectable()
export class TypeData {

  constructor(private _fsApi: FsApi) { }

  public create(data: Type = { id: null }): Type {
    data.class = data.class || 'task';
    return data;
  }

  public get(type_id, query = {}): Observable<any> {
    return this._fsApi.get(`types/${type_id}`, query, { key: 'type' });
  }

  public gets(data = {}, config = {}): Observable<any> {
    return this._fsApi.request('GET', 'types', data, Object.assign({ key: 'types' }, config));
  }

  public put(type, config = {}): Observable<any> {
    return this._fsApi.put(`types/${type.id}`, type, Object.assign({ key: 'type' }, config));
  }

  public post(type): Observable<any> {
    return this._fsApi.post('types', type, { key: 'type' });
  }

  public delete(type): Observable<any> {
    return this._fsApi.delete(`types/${type.id}`, type, { key: 'type' });
  }

  public save(data): Observable<any> {
    if (data.id) {
      return this.put(data);
    }
    return this.post(data);
  }

  public order(data): Observable<any> {
    return this._fsApi.put('types/order', data, { key: null });
  }

}
