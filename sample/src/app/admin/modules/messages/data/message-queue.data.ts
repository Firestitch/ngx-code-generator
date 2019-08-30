import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { FsApi } from '@firestitch/api';


@Injectable()
export class MessageQueueData {

  constructor(private _fsApi: FsApi) { }

  public create(data) {
    return data;
  }

  public get(id, query = {}): Observable<any> {
    return this._fsApi.get(`admin/messages/queues/${id}`, query, { key: 'message_queue' });
  }

  public gets(data = {}, config = {}): Observable<any> {
    return this._fsApi.request('GET', 'admin/messages/queues', data, Object.assign({ key: 'message_queues' }, config));
  }

  public put(data, config = {}): Observable<any> {
    return this._fsApi.put(`admin/messages/queues/${data.id}`, data, Object.assign({ key: 'message_queues' }, config));
  }

  public resend(data, config = {}): Observable<any> {
    return this._fsApi.post(`admin/messages/queues/${data.id}/resend`, data, Object.assign({ key: 'message_queues' }, config));
  }

  public forward(data, value, config = {}): Observable<any> {
    return this._fsApi.post(`admin/messages/queues/${data.id}/forward`, { recipient: value }, Object.assign({ key: 'message_queues' }, config));
  }

  public logsGets(data, config = {}): Observable<any> {
    return this._fsApi.request('GET', `admin/messages/queues/${data.id}/logs`, {}, Object.assign({ key: 'message_logs' }, config));
  }

  public save(data): Observable<any> {
    if (data.id) {
      return this.put(data);
    }
  }
}
