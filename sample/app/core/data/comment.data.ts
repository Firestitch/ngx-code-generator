import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FsApi } from '@firestitch/api';

@Injectable()
export class CommentData {
  constructor(private _fsApi: FsApi) {
  }

  public get(comment_id, query = {}): Observable<any> {
      return this._fsApi.get(`comments/${comment_id}`, query, { key: 'comment' });
  }

  public gets(data = {}, config = {}): Observable<any> {
      return this._fsApi.request('GET', 'comments', data, Object.assign({ key: 'comments' }, config));
  }

  public put(comment, config = {}): Observable<any> {
      return this._fsApi.put(`comments/${comment.id}`, comment, Object.assign({ key: 'comment' }, config));
  }

  public post(comment): Observable<any> {
      return this._fsApi.post(`comments/tasks/${comment.object_id}`, {content: comment.content}, { key: 'comment' });
  }

  public delete(data, type): Observable<any> {
      return this._fsApi.delete(`comments/${type}/${data.object_id}/${data.comment.id}`, data.comment, { key: 'comment' });
  }

  public save(data): Observable<any> {
      if (data.id) {
      return this.put(data);
    }
    return this.post(data);
  }

}
