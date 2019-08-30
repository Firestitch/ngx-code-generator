import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { FsApi } from '@firestitch/api';

import { Project } from '../../shared/interfaces';


@Injectable()
export class ProjectData {

  constructor(private _fsApi: FsApi) { }

  public create(data: Project = { id: null }): Project {
    return data;
  }

  public get(project_id, query = {}): Observable<any> {
      return this._fsApi.get(`projects/${project_id}`, query, { key: 'project' });
  }

  public gets(data = {}, config = {}): Observable<any> {
      return this._fsApi.request('GET', 'projects', data, Object.assign({ key: 'projects' }, config));
  }

  public put(project, config = {}): Observable<any> {
      return this._fsApi.put(`projects/${project.id}`, project, Object.assign({ key: 'project' }, config));
  }

  public post(project): Observable<any> {
      return this._fsApi.post('projects', project, { key: 'project' });
  }

  public delete(project): Observable<any> {
      return this._fsApi.delete(`projects/${project.id}`, project, { key: 'project' });
  }

  public save(data): Observable<any> {
      if (data.id) {
      return this.put(data);
    }
    return this.post(data);
  }

  public image(project, file): Observable<any> {
    return this._fsApi.post(`projects/${project.id}/image`, { file: file }, { key: 'project' });
  }
}
