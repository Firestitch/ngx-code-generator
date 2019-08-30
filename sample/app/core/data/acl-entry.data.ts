import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { FsApi } from '@firestitch/api';

import { AclEntry } from 'app/shared/interfaces';


@Injectable()
export class AclEntryData {

  public create(data: AclEntry = { id: null }) {
    return data;
  }

  constructor(private _api: FsApi) { }

  public save(data): Observable<any> {
    if (data.id) {
      return this.put(data);
    }
    return this.post(data);
  }

  public get(id, data = {}): Observable<any> {
    return this._api.get(`${this.getEndpoint(data)}/entries/${id}`, data, { key: 'acl_entry' });
  }

  public gets(data = {}, config = {}): Observable<any> {
    return this._api.request(`GET`, `${this.getEndpoint(data)}/entries`, data, Object.assign({ key: 'acl_entries' }, config));
  }

  public put(data, config = {}): Observable<any> {
    return this._api.put(`${this.getEndpoint(data)}/entries/${data.id}`, data, Object.assign({ key: 'acl_entry' }, config));
  }

  public post(data): Observable<any> {
    return this._api.post(`${this.getEndpoint(data)}/entries`, data, { key: 'acl_entry' });
  }

  public delete(data): Observable<any> {
    return this._api.delete(`${this.getEndpoint(data)}/entries/${data.id}`, data, { key: 'acl_entry' });
  }

  private getEndpoint(data: any) {
    return data.workspace_id ? `workspaces/${data.workspace_id}` : `acl`;
  }

}
