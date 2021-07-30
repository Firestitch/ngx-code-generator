import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

@Injectable()
export class ServicesService {
  constructor(private _http: HttpClient) {}

  public listOfServices() {
    return this._http.get('/services');
  }

  public generateService(params) {
    return this._http.post('/generate/service', params);
  }
}
