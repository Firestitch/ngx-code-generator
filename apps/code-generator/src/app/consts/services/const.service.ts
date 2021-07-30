import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ConstService {
  constructor(private _http: HttpClient) {}

  public getEnumsForModule(modulePath: string) {
    return this._http.get('/generate/enums-list', {
      params: { enumPath: modulePath },
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
