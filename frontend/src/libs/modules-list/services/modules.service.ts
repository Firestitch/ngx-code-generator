import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { of } from 'rxjs';


@Injectable()
export class ModulesService {
  constructor(private _http: HttpClient) {
  }

  public listOfModules() {
    return this._http.get('/modules');
  }

  public generateModule(params) {
    return this._http.post('/generate/module', params);
  }

  public getModulesFor(currentPath) {
    return this._http.get('/get-modules-for', {
      params: {
        currentPath: currentPath,
      },
    });
  }
}
