import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { FsApi } from '@firestitch/api';

import { Status } from '../../shared/interfaces';


@Injectable()
export class StatusData {

  constructor(private _fsApi: FsApi) { }

  public create(data: Status = { id: null }): Status {
    data.class = data.class || 'task';
    return data;
  }

  public get(id, query = {}): Observable<any> {
    return this._fsApi.get(`statuses/${id}`, query, { key: 'status' });
  }

  public gets(data = {}, config = {}): Observable<any> {
    return this._fsApi.request('GET', 'statuses', data, Object.assign({ key: 'statuses' }, config));
  }

  public put(data, config = {}): Observable<any> {
    return this._fsApi.put(`statuses/${data.id}`, data, Object.assign({ key: 'status' }, config));
  }

  public post(data): Observable<any> {
    return this._fsApi.post('statuses', data, { key: 'status' });
  }

  public delete(data): Observable<any> {
    return this._fsApi.delete(`statuses/${data.id}`, data, { key: 'status' });
  }

  public save(data): Observable<any> {
    if (data.id) {
      return this.put(data);
    }
    return this.post(data);
  }

  public order(data): Observable<any> {
    return this._fsApi.put('statuses/order', data, { key: null });
  }

  public setDefault(status_id: number, data = {}): Observable<any> {
    return this._fsApi.put(`statuses/${status_id}/default`, data, { key: 'status' });
  }
}
