import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { FsApi } from '@firestitch/api';


@Injectable()
export class DocData {
  constructor(private _fsApi: FsApi) { }

  public create(data = { id: null }) {
    return data;
  }

  /**
   * @param {number | string} doc_id could be doc_id or doc_code identifier (PR-D1)
   */
  public get(doc_id: number | string, query = {}): Observable<any> {
    return this._fsApi.get(`docs/${doc_id}`, query, { key: 'doc' });
  }

  public gets(data = {}, config = {}): Observable<any> {
    return this._fsApi.request('GET', 'docs', data, Object.assign({ key: 'docs' }, config));
  }

  public put(doc, config = {}): Observable<any> {
    return this._fsApi.put(`docs/${doc.id}`, doc, Object.assign({ key: 'doc' }, config));
  }

  public post(doc, config = { key: 'doc' }): Observable<any> {
    return this._fsApi.post('docs', doc, { key: 'doc' });
  }

  public delete(doc): Observable<any> {
    return this._fsApi.delete(`docs/${doc.id}`, doc, { key: 'doc' });
  }

  public bulkDelete(doc_ids: number[]): Observable<any> {
    return this._fsApi.delete(`docs/bulk`, { doc_ids }, { key: 'docs' });
  }

  public saveNewVersion(doc_id: number, data: any): Observable<any> {
    return this._fsApi.post(`docs/${doc_id}/content`, data, { key: 'doc' });
  }

  public save(data, config = { key: 'doc' }): Observable<any> {
    if (data.id) {
      return this.put(data, config);
    }
    return this.post(data, config);
  }

  public getParsedName(data): Observable<any> {
    return this._fsApi.get(`docs/name`, data, { key: 'name' });
  }

}
