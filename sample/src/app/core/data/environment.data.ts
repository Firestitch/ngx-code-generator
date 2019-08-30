import { Injectable } from '@angular/core';

import { FsApi } from '@firestitch/api';

import { Observable } from 'rxjs';

import { AclRole } from '@app/shared';


@Injectable()
export class EnvironmentData {

  constructor(private _api: FsApi) { }

  public save(data): Observable<any> {
    if (data.id) {
      return this.put(data);
    }
    return this.post(data);
  }

  public get(environment_id, data: any = {}): Observable<any> {
    return this._api.get(`environments/${environment_id}`, data, { key: 'environment' });
  }

  public gets(data: any = {}, config = {}): Observable<any> {
    return this._api.request(`GET`, `environments`, data, Object.assign({ key: 'environments' }, config));
  }

  public put(environment, config = {}): Observable<any> {
    return this._api.put(`environments/${environment.id}`, environment, Object.assign({ key: 'environment' }, config));
  }

  public post(environment): Observable<any> {
    return this._api.post(`environments`, environment, { key: 'environment' });
  }

  public delete(environment): Observable<any> {
    return this._api.delete(`environments/${environment.id}`, environment, { key: 'environment' });
  }

  public switch(account_id: number, environment_id: number): Observable<any> {
    return this._api.put(`accounts/${account_id}/environments/${environment_id}/switch`, null, Object.assign({ key: 'environment' }));
  }

  public image(environment, file): Observable<any> {
    return this._api.post(`environments/${environment.id}/image`, { file: file }, { key: 'environment' });
  }

  public getAccounts(environment_id: number, data: any = {}, config = {}): Observable<any> {
    return this._api.request(`GET`, `environments/${environment_id}/accounts`, data, Object.assign({ key: 'environment_accounts' }, config));
  }

  public getAccount(environment_id: number, data: any = {}, config = {}): Observable<any> {
    return this._api.request(`GET`, `environments/${environment_id}/accounts/${data.account_id}`, data, Object.assign({ key: 'environment_account' }, config));
  }

  public putAccounts(environment_id: number, data: any = {}, config = {}): Observable<any> {
    return this._api.put(`environments/${environment_id}/accounts/${data.account_id}`,
      data, Object.assign({ key: 'object_account' }, config));
  }

  public deleteAccounts(environment_id: number, data: any = {}, config = {}): Observable<any> {
    return this._api.delete(`environments/${environment_id}/accounts/${data.account_id}`,
      data, Object.assign({ key: 'object_account' }, config));
  }

  public getRole(environment_id: number, role_id: number, data: any = {}, config = {}): Observable<any> {
    return this._api.request(`GET`, `environments/${environment_id}/roles/${role_id}`, data, Object.assign({ key: 'acl_role' }, config));
  }

  public getRoles(environment_id: number, data: any = {}, config = {}): Observable<any> {
    return this._api.request(`GET`, `environments/${environment_id}/roles`, data, Object.assign({ key: 'acl_roles' }, config));
  }

  public deleteRole(environment_id: number, role: AclRole): Observable<any> {
    return this._api.delete(`environments/${environment_id}/roles/${role.id}`, role, { key: 'acl_role' });
  }

  public updateRole(environment_id: number, role: AclRole): Observable<any> {
    return this._api.put(`environments/${environment_id}/roles/${role.id}`, role, { key: 'acl_role' });
  }

  public postRole(environment_id: number, role: AclRole): Observable<any> {
    return this._api.post(`environments/${environment_id}/roles`, role, { key: 'acl_role' });
  }

  public saveRole(environment_id: number, data): Observable<any> {
    if (data.id) {
      return this.updateRole(environment_id, data);
    }
    return this.postRole(environment_id, data);
  }

  public assignRoles(environment_id, account_id, data: any = {}, config = {}): Observable<any> {
    data.account_id = account_id;
    return this._api.put(`environments/${environment_id}/entries/bulk`,
      data, Object.assign({ key: null }, config));
  }
}
