import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { FsApi } from '@firestitch/api';


@Injectable()
export class ObjectData {

  constructor(
    private _fsApi: FsApi
  ) { }

  public get(object_id, query = {}): Observable<any> {
    return this._fsApi.get(`objects/${object_id}`, query, { key: 'object' });
  }

  public gets(data = {}, config = {}): Observable<any> {
    return this._fsApi.request('GET', 'objects', data, Object.assign({ key: 'objects' }, config));
  }

  public highlight(object_id: number, data): Observable<any> {
    return this._fsApi.post(`objects/${object_id}/highlight`, data, { key: null });
  }

  public unhighlight(object_id: number, data): Observable<any> {
    return this._fsApi.delete(`objects/${object_id}/highlight`, data, { key: null });
  }

  public relate(object_id: number, relative_object_id: number) {
    return this._fsApi.post(`objects/${object_id}/relate`, { object_id: relative_object_id }, {key: 'objects'})
  }

  public removeRelative(object_id: number, relative_object_id: number) {
    return this._fsApi.delete(`objects/${object_id}/relate`, { object_id: relative_object_id });
  }

  public getVersion(object_id, object_version_id, query = {}): Observable<any> {
    return this._fsApi.get(`objects/${object_id}/versions/${object_version_id}`, query, { key: 'object_version' });
  }

  public getVersions(object_id, data = {}, config = {}): Observable<any> {
    return this._fsApi.request('GET', `objects/${object_id}/versions`, data, Object.assign({ key: 'object_versions' }, config));
  }

  public restoreVersion(object_id: number, object_version_id: number) {
    return this._fsApi.post(`objects/${object_id}/versions/${object_version_id}/restore`, null, {key: 'object_version'})
  }
}
