import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable()
export class ModulesService {
  constructor(private _http: HttpClient) {
  }

  public listOfModules(project: string): Observable<any> {
    return this._http.get('/modules', { params: { project } });
  }

  public listOfProjects() {
    return this._http.get<any>('/projects');
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
