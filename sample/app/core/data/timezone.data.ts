import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { FsApi } from '@firestitch/api';


@Injectable()
export class TimezoneData {

  constructor(private _fsApi: FsApi) { }

  public gets(data = {}, config = {}): Observable<any> {
    return this._fsApi.request('GET', 'timezones', data, Object.assign({ key: 'timezones' }, config));
  }

}
