import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { FsApi } from '@firestitch/api';


@Injectable()
export class FieldData {

  constructor(private _fsApi: FsApi) { }

  public create(data = { id: null }) {
    return data;
  }

  public updateConfig(object_id: number, data: {}): Observable<any> {
    return this._fsApi.put(`fields/${object_id}`, data, { key: 'fields' });
  }

  public getConfig(object_id: number): Observable<any> {
    return this._fsApi.get(`fields/${object_id}`, null, { key: 'fields' });
  }

  public updateValues(config_object_id: number, value_object_id: number, version_id: number, data: any = {}): Observable<any> {
    return this._fsApi.post(`fields/${config_object_id}/values/${value_object_id}/${version_id}`, data, { key: 'data' });
  }

  public getValues(
    config_object_id: number,
    value_object_id: number,
    version_id: number,
    data = {},
    config = { key: 'fields' }
    ): Observable<any> {
    return this._fsApi.get(`fields/${config_object_id}/values/${value_object_id}/${version_id}`, data, config);
  }
}
