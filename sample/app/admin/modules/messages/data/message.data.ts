import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { FsApi } from '@firestitch/api';


@Injectable()
export class MessageData {

  constructor(private _fsApi: FsApi) { }

  public create(data) {
    return data;
  }

  public get(id, query = {}): Observable<any> {
    return this._fsApi.get(`admin/messages/${id}`, query, { key: 'message' });
  }

  public gets(data = {}, config = {}): Observable<any> {
    return this._fsApi.request('GET', 'admin/messages', data, Object.assign({ key: 'messages' }, config));
  }

  public put(data, config = {}): Observable<any> {
    return this._fsApi.put(`admin/messages/${data.id}`, data, Object.assign({ key: 'message' }, config));
  }

  public sendTest(data, recipients, config = {}): Observable<any> {
    return this._fsApi.post(`admin/messages/${data.id}/sendtest`, recipients, Object.assign({ key: 'message' }, config));
  }

  public save(data): Observable<any> {
    if (data.id) {
      return this.put(data);
    }
  }
}
