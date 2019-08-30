import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { FsApi } from '@firestitch/api';


@Injectable()
export class CronData {
  constructor(private _fsApi: FsApi) { }

  public create(data = { id: null }) {
    return data;
  }

  public get(cron_id: number | string, query = {}): Observable<any> {
    return this._fsApi.get(`system/crons/${cron_id}`, query, { key: 'cron' });
  }

  public gets(data = {}, config = {}): Observable<any> {
    return this._fsApi.request('GET', 'system/crons', data, Object.assign({ key: 'cron' }, config));
  }

  public enable(cron, config = {}): Observable<any> {
    return this._fsApi.put(`system/crons/${cron.id}/enable`, cron, Object.assign({ key: 'cron' }, config));
  }

  public disable(cron, config = {}): Observable<any> {
    return this._fsApi.put(`system/crons/${cron.id}/disable`, cron, Object.assign({ key: 'cron' }, config));
  }

  public kill(cron, config = {}): Observable<any> {
    return this._fsApi.put(`system/crons/${cron.id}/kill`, cron, Object.assign({ key: 'cron' }, config));
  }

  public queue(cron, config = {}): Observable<any> {
    return this._fsApi.put(`system/crons/${cron.id}/queue`, cron, Object.assign({ key: 'cron' }, config));
  }

  public run(cron, config = {}): Observable<any> {
    return this._fsApi.put(`system/crons/${cron.id}/run`, cron, Object.assign({ key: 'cron' }, config));
  }
}
