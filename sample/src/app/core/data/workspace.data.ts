import { Injectable } from '@angular/core';

import { FsApi } from '@firestitch/api';

import { Observable } from 'rxjs';


@Injectable()
export class WorkspaceData {

  constructor(private _api: FsApi) { }

  public get(workspace_id, data: any = {}): Observable<any> {
    return this._api.get(`workspaces/${workspace_id}`, data, { key: 'workspace' });
  }

  public gets(data: any = {}, config = {}): Observable<any> {
    return this._api.request(`GET`, `workspaces`, data, Object.assign({ key: 'workspaces' }, config));
  }
}
