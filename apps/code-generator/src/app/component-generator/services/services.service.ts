import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable()
export class ServicesService {
  constructor(private _http: HttpClient) {}

  public listOfServices(project, module): Observable<any> {
    return this._http.get('/services', { params: { project, module }});
  }

  public generateService(params) {
    return this._http.post('/generate/service', params);
  }
}
