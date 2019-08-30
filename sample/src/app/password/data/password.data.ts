import { Injectable } from '@angular/core';
import { FsApi } from '@firestitch/api';
import { Observable } from 'rxjs';

@Injectable()
export class PasswordData {

  constructor(private _api: FsApi) {
  }

  public request(data, options?): Observable<any> {
    return this._api.post('password/request', data, options);
  }

  public reset(data, options?): Observable<any> {
    return this._api.post('password/reset', data, options);
  }
}
