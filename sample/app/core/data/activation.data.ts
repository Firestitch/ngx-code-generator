import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { FsApi } from '@firestitch/api';


@Injectable()
export class ActivationData {

  constructor(private _fsApi: FsApi) { }

  public valid(data, options: any = {}): Observable<any> {
    return this._fsApi.post('activations/valid', data, Object.assign({ key: null }, options));
  }

  public activate(data): Observable<any> {
    return this._fsApi.post('activations/activate', data, { key: null });
  }

  public resend(data): Observable<any> {
    return this._fsApi.post('activations/resend', data, { key: null });
  }
}
