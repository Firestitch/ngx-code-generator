import { Injectable } from '@angular/core';
import { FsApi } from '@firestitch/api';
import { Observable } from 'rxjs';


@Injectable()
export class ContentData {

  constructor(private _api: FsApi) {}

  public save(data): Observable<any> {
    if (data.id) {
      return this.put(data);
    }
    return this.post(data);
  }

  public get(query): Observable<any> {
    return this._api.get(`contents`, query, { key: 'content_widget' });
  }

  public gets(data = {}, config = {}): Observable<any> {
    return this._api.request(`GET`, `contents`, data, Object.assign({ key: 'content_widgets' }, config));
  }

  public put(content_widget, config = {}): Observable<any> {
    return this._api.put(`contents/${content_widget.id}`, content_widget, Object.assign({ key: 'content_widget' }, config));
  }

  public post(content_widget): Observable<any> {
    return this._api.post(`contents`, content_widget, { key: 'content_widget' });
  }

  public delete(content_widget): Observable<any> {
    return this._api.delete(`contents/${content_widget.id}`, content_widget, { key: 'content_widget' });
  }
}
