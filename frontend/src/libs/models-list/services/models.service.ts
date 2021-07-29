import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable()
export class ModelsService {
  constructor(private _http: HttpClient) {
  }

  public list() {
    return this._http.get('/utility/models');
  }

}
