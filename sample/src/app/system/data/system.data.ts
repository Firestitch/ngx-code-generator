import { Injectable } from '@angular/core';

import { FsApi } from '@firestitch/api';

import { Observable } from 'rxjs';


@Injectable()
export class SystemData {

  constructor(private _api: FsApi) { }

  public filesGet(data: any = {}): Observable<any> {
    return this._api.get(`system/files`, data, { key: 'storage_objects' });
  }

  public filesDelete(data: any = {}): Observable<any> {
    return this._api.delete(`system/files`, data, { key: '' });
  }

  public filesDownload(data: any = {}): Observable<any> {
    return this._api.get(`system/files/download`, data, { key: 'url' });
  }

  public filesUpload(data: any = {}): Observable<any> {
    return this._api.post(`system/files/upload`, data, { key: '' });
  }

  public filesDirectoriesDelete(data: any = {}, config = {}): Observable<any> {
    return this._api.delete(`system/files/directories`, data, { key: '' });
  }

  public filesDirectoriesPost(data: any = {}, config = {}): Observable<any> {
    return this._api.post(`system/files/directories`, data, { key: '' });
  }

  public logsServerGets(data: any = {}, config = {}): Observable<any> {
    return this._api.get(`system/logs/server`, data, Object.assign({ key: 'logs' }, config));
  }

  public logsApiGets(data: any = {}, config = {}): Observable<any> {
    return this._api.get(`system/logs/api`, data, Object.assign({ key: 'api_logs' }, config));
  }

  public logsApiGet(api_log_id: any = {}, config = {}): Observable<any> {
    return this._api.get(`system/logs/api/${api_log_id}`, {}, Object.assign({ key: 'api_log' }, config));
  }

  public logsUpgradeGets(data: any = {}, config = {}): Observable<any> {
    return this._api.get(`system/logs/upgrade`, data, Object.assign({ key: 'upgrades' }, config));
  }

  public logsGet(log_id: any = {}, config = {}): Observable<any> {
    return this._api.get(`system/logs/server/${log_id}`, {}, Object.assign({ key: 'log' }, config));
  }

  public settingsGets(data: any = {}, config = {}): Observable<any> {
    return this._api.get(`system/settings`, data, Object.assign({ key: 'settings' }, config));
  }

  public processesGets(data: any = {}, config = {}): Observable<any> {
    return this._api.get(`system/processes`, data, Object.assign({ key: 'processes' }, config));
  }

  public settingsBulk(data: any = {}, config = {}): Observable<any> {
    return this._api.post(`system/settings/bulk`, data, Object.assign({ key: 'settings' }, config));
  }
}
