import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { FsApi } from '@firestitch/api';


@Injectable()
export class MessageTemplateData {

  constructor(private _fsApi: FsApi) { }

  public create(data) {
    return data;
  }

  public get(id, query = {}): Observable<any> {
    return this._fsApi.get(`admin/messages/templates/${id}`, query, { key: 'message_template' });
  }

  public gets(data = {}, config = {}): Observable<any> {
    return this._fsApi.request('GET', 'admin/messages/templates', data, Object.assign({ key: 'message_templates' }, config));
  }

  public put(data, config = {}): Observable<any> {
    return this._fsApi.put(`admin/messages/templates/${data.id}`, data, Object.assign({ key: 'message_template' }, config));
  }

  public post(data, config = {}): Observable<any> {
    return this._fsApi.post(`admin/messages/templates/`, data, Object.assign({ key: 'message_template' }, config));
  }

  public save(data): Observable<any> {
    if (data.id) {
      return this.put(data);
    } else {
      return this.post(data);
    }

  }
}
