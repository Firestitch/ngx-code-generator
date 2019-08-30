import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { FsApi } from '@firestitch/api';
import { map } from 'rxjs/operators';


@Injectable()
export class AssetData {

  constructor(private _fsApi: FsApi) { }

  public create(data = { id: null }) {
    return data;
  }

  public get(asset_id: number | string, query = {}): Observable<any> {
    return this._fsApi.get(`assets/${asset_id}`, query, { key: 'asset' });
  }

  public gets(data = {}, config = {}): Observable<any> {
    return this._fsApi.request('GET', 'assets', data, Object.assign({ key: 'assets' }, config));
  }

  public put(asset, config = {}): Observable<any> {
    return this._fsApi
      .put(`assets/${asset.id}`, asset, Object.assign({ key: 'asset' }, Object.assign({ headers: { FsUpload: true } }, config)));
  }

  public order(data, config = {}): Observable<any> {
    return this._fsApi.put(`assets/order`, data, Object.assign({ key: null }, config));
  }

  public post(asset): Observable<any> {
    let url = 'assets';
    if (asset.id && asset.file && asset.file instanceof File) {
      url += `/${asset.id}`;
    }
    return this._fsApi.post(url, asset, { key: 'asset', headers: { FsUpload: true } })
      .pipe(
        map(response => {
          return response;
        })
      );
  }

  public delete(asset): Observable<any> {
    return this._fsApi.delete(`assets/${asset.id}`, asset, { key: 'asset' });
  }

  public bulkDelete(data): Observable<any> {
    return this._fsApi.delete(`assets/bulk`, data, { key: 'assets' });
  }

  public save(data): Observable<any> {
    if (data.id) {
      return this.put(data);
    }
    return this.post(data);
  }

}
