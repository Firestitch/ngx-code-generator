import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { FsApi } from '@firestitch/api';
import { FsTransferService } from '@firestitch/transfer';
import { TimeEntry } from '../interfaces';
import { TimeEntryType } from '../enums';




@Injectable()
export class TimeEntryData {

  constructor(
    private _fsApi: FsApi,
    private _transfer: FsTransferService
  ) { }

  public create(data: TimeEntry = {}): TimeEntry {
    data.timezone = data.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
    data.type = data.type || TimeEntryType.Timer;
    return data;
  }

  public get(id, query = {}): Observable<any> {
    return this._fsApi.get(`timeentries/${id}`, query, { key: 'time_entry' });
  }

  public gets(data = {}, config = {}): Observable<any> {
    return this._fsApi.request('GET', 'timeentries', data, Object.assign({ key: 'time_entries' }, config));
  }

  public put(data, config = {}): Observable<any> {
    return this._fsApi.put(`timeentries/${data.id}`, data, Object.assign({ key: 'time_entry' }, config));
  }

  public post(data): Observable<any> {
    return this._fsApi.post('timeentries', data, { key: 'time_entry' });
  }

  public delete(data): Observable<any> {
    return this._fsApi.delete(`timeentries/${data.id}`, data, { key: 'time_entry' });
  }

  public save(data): Observable<any> {
    if (data.id) {
      return this.put(data);
    }
    return this.post(data);
  }

  public export(data) {
    return this._transfer.post(`api/timeentries/export`, data);
  }

}
