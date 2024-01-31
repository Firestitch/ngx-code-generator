import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ConstService {
  constructor(private _http: HttpClient) {}

  public getEnumsForModule(project: string, modulePath: string) {
    return this._http.get('/generate/enums-list', {
      params: { 
        enumPath: modulePath,
        project,
      },
    });
  }

  public getEnumDetails(enumPath: string) {
    return this._http.get('/generate/enum-keys-list', {
      params: {
        enumPath: enumPath,
      },
    });
  }
}
