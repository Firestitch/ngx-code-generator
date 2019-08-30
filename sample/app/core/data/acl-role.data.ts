import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { FsApi } from '@firestitch/api';


@Injectable()
export class AclRoleData {

  constructor(private _api: FsApi) { }

  public save(data): Observable<any> {
    if (data.id) {
      return this.put(data);
    }
    return this.post(data);
  }

  public permissions(): Observable<any> {
    return this._api.get(`acl/permissions`, {}, { key: 'permissions' });
  }

  public get(id, data = {}): Observable<any> {
    return this._api.get(`acl/roles/${id}`, data, { key: 'acl_role' });
  }

  public gets(data = {}, config = {}): Observable<any> {
    return this._api.request(`GET`, `acl/roles`, data, Object.assign({ key: 'acl_roles' }, config));
  }

  public put(data, config = {}): Observable<any> {
    return this._api.put(`acl/roles/${data.id}`, data, Object.assign({ key: 'acl_role' }, config));
  }

  public post(data): Observable<any> {
    return this._api.post(`acl/roles`, data, { key: 'acl_role' });
  }

  public delete(data): Observable<any> {
    return this._api.delete(`acl/roles/${data.id}`, data, { key: 'acl_role' });
  }
}
