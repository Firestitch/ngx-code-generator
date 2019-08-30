import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { FsApi } from '@firestitch/api';

import { Role } from '../../shared/interfaces';


@Injectable()
export class RoleData {

  constructor(private _fsApi: FsApi) { }

  public create(data: Role = { id: null }) {
    return data;
  }

  public get(id, data = {}): Observable<any> {
      return this._fsApi.get(`roles/${id}`, data, { key: 'role' });
  }

  public gets(data = {}, config = {}): Observable<any> {
      return this._fsApi.request('GET', 'roles', data, Object.assign({ key: 'roles' }, config));
  }

  public put(data, config = {}): Observable<any> {
      return this._fsApi.put(`roles/${data.id}`, data, Object.assign({ key: 'role' }, config));
  }

  public post(data): Observable<any> {
      return this._fsApi.post('roles', data, { key: 'role' });
  }

  public delete(data): Observable<any> {
      return this._fsApi.delete(`roles/${data.id}`, data, { key: 'role' });
  }

  public save(data): Observable<any> {
      if (data.id) {
      return this.put(data);
    }
    return this.post(data);
  }

}
