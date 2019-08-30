import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { FsApi } from '@firestitch/api';

import { Attribute } from '../../shared/interfaces';


@Injectable()
export class AttributeData {

  constructor(
    private _fsApi: FsApi
  ) { }

  public create(data: Attribute = { id: null }): Attribute {
    data.configs = data.configs || {};
    return data;
  }

  public get(id, query = {}): Observable<any> {
    return this._fsApi.get(`attributes/${id}`, query, { key: 'attribute' });
  }

  public gets(data = {}, config = {}): Observable<any> {
    return this._fsApi.request('GET', 'attributes', data, Object.assign({ key: 'attributes' }, config));
  }

  public put(data, config = {}): Observable<any> {
    return this._fsApi.put(`attributes/${data.id}`, data, Object.assign({ key: 'attribute' }, config));
  }

  public post(data): Observable<any> {
    return this._fsApi.post('attributes', data, { key: 'attribute' });
  }

  public delete(data): Observable<any> {
    return this._fsApi.delete(`attributes/${data.id}`, data, { key: 'attribute' });
  }

  public save(data): Observable<any> {
    if (data.id) {
      return this.put(data);
    }
    return this.post(data);
  }

  public order(data): Observable<any> {
    return this._fsApi.put('attributes/order', data, { key: null });
  }

  public getObjectAttributes(object_id, data, options = {}): Observable<any> {
    return this._fsApi.get(`objects/${object_id}/attributes`, data, Object.assign({ key: 'attributes' }, options));
  }

  public getObjectAttribute(object_id, attribute_id, data): Observable<any> {
    return this._fsApi.get(`objects/${object_id}/attributes/${attribute_id}`, data, { key: 'attribute' });
  }

  public assignObject(attribute_id, object_id): Observable<any> {
    return this._fsApi.put(`objects/${object_id}/attributes/${attribute_id}`, null, { key: 'attribute' });
  }

  public deleteObject(attribute_id, object_id): Observable<any> {
    return this._fsApi.delete(`objects/${object_id}/attributes/${attribute_id}`, null, { key: null });
  }

  public image(data, file): Observable<any> {
    return this._fsApi.post(`attributes/${data.id}/image`, { file: file }, { key: 'attribute' });
  }
}
