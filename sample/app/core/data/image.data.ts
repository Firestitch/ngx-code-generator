import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { FsApi } from '@firestitch/api';


@Injectable()
export class ImageData {

  constructor(private _fsApi: FsApi) { }

  public image(file): Observable<any> {
    return this._fsApi.post(`image`, { file: file }, { key: 'url' });
  }

}
