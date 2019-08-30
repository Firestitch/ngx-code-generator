import { Injectable } from '@angular/core';
import { FsApi, FsApiConfig } from '@firestitch/api';
import { Observable } from 'rxjs';

@Injectable()
export class AuditData {

  constructor(private _fsApi: FsApi) {}

  public gets(data = {}, options = {}): Observable<any> {
    return this._fsApi.request(`GET`, `audits`, data, new FsApiConfig(Object.assign({ key: 'audits' }, options)));
  }

  public delete(data, options = {}): Observable<any> {
    return this._fsApi.request(`DELETE`, `audits/${data.id}`, data, new FsApiConfig(Object.assign({ key: 'audits' }, options)));
  }

  public put(audit, config = {}): Observable<any> {
    return this._fsApi.put(`audits/${audit.id}`, audit, Object.assign({ key: 'audit' }, config));
  }
  public types(object_type): Observable<any> {
    return this._fsApi.request(`GET`, `audits/types`, {}, new FsApiConfig(Object.assign({ key: 'types' }, {})));
  }

  public object_classes(object_type): Observable<any> {
    return this._fsApi.request(`GET`, `audits/objectclasses`, {}, new FsApiConfig(Object.assign({ key: 'objectclasses' }, {})));
  }



}
