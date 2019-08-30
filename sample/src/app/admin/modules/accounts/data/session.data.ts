import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { FsApi } from '@firestitch/api';


@Injectable()
export class SessionData {

  constructor(private _fsApi: FsApi) { }

  public create(data) {
    return data;
  }

  public get(id, query = {}): Observable<any> {
    return this._fsApi.get(`admin/sessions/${id}`, query, { key: 'session' });
  }

  public delete(data, query = {}): Observable<any> {
    return this._fsApi.delete(`admin/sessions/${data.id}`, query, { key: 'session' });
  }

  public gets(data = {}, config = {}): Observable<any> {
    return this._fsApi.request('GET', 'admin/sessions', data, Object.assign({ key: 'sessions' }, config));
  }

  public put(data, config = {}): Observable<any> {
    return this._fsApi.put(`admin/sessions/${data.id}`, data, Object.assign({ key: 'session' }, config));
  }

  public save(data): Observable<any> {
    if (data.id) {
      return this.put(data);
    }
  }
}
