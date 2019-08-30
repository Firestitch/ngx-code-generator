import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { FsApi } from '@firestitch/api';

import { Workflow, WorkflowStep, WorkflowPath, WorkflowAction } from '../../shared/interfaces';


@Injectable()
export class WorkflowData {

  constructor(private _fsApi: FsApi) { }

  public create(data: Workflow = { id: null }): Workflow {
    return data;
  }

  public createStep(data: WorkflowStep = { id: null }): WorkflowStep {
    data.x1 = data.x1 || 0;
    data.y1 = data.y1 || 0;
    return data;
  }

  public createPath(data: WorkflowPath = { id: null }): WorkflowPath {
    return data;
  }

  public createAction(data: WorkflowAction ): WorkflowAction {
    if (data.id) {
      return data;
    }

    const defaultData = {
      id: null,
      configs: { },
    };

    Object.assign(data, defaultData);
    return data;
  }

  public get(id: number, query = {}): Observable<any> {
    return this._fsApi.get(`workflows/${id}`, query, { key: 'workflow' });
  }

  public gets(data = {}, config = {}): Observable<any> {
    return this._fsApi.request('GET', 'workflows', data, Object.assign({ key: 'workflows' }, config));
  }

  public put(data, config = {}): Observable<any> {
    return this._fsApi.put(`workflows/${data.id}`, data, Object.assign({ key: 'workflow' }, config));
  }

  public post(data): Observable<any> {
    return this._fsApi.post('workflows', data, { key: 'workflow' });
  }

  public delete(data): Observable<any> {
    return this._fsApi.delete(`workflows/${data.id}`, data, { key: 'workflow' });
  }

  public save(data): Observable<any> {
    if (data.id) {
      return this.put(data);
    }
    return this.post(data);
  }

  public getTasks(workflow_id: number, task_id: number, data = {}): Observable<any> {
    return this._fsApi.get(`workflows/${workflow_id}/tasks/${task_id}`, data, { key: 'workflow_task' });
  }

  public getsTasks(workflow_id: number, data = {}, config = {}): Observable<any> {
    return this._fsApi.request('GET', `workflows/${workflow_id}/tasks`, data, Object.assign({ key: 'workflow_tasks' }, config));
  }

  public postTasks(workflow_id: number, data): Observable<any> {
    return this._fsApi.post(`workflows/${workflow_id}/tasks`, data, { key: 'workflow_step' });
  }

  public putTasks(workflow_id: number, data): Observable<any> {
    return this._fsApi.put(`workflows/${workflow_id}/tasks/${data.id}`, data, { key: 'workflow_task' });
  }

  public deleteTasks(workflow_id: number, data): Observable<any> {
    return this._fsApi.delete(`workflows/${workflow_id}/tasks/${data.id}`, data, { key: 'workflow_task' });
  }

  public saveTasks(workflow_id: number, data): Observable<any> {
    if (data.id) {
      return this.putTasks(workflow_id, data);
    }
    return this.postTasks(workflow_id, data);
  }

  public getSteps(workflow_id: number, step_id: number, data = {}): Observable<any> {
    return this._fsApi.request('GET', `workflows/${workflow_id}/steps/${step_id}`, data,{ key: 'workflow_step' });
  }

  public getsSteps(workflow_id: number, data = {}, config = {}): Observable<any> {
    return this._fsApi.request('GET', `workflows/${workflow_id}/steps`, data, Object.assign({ key: 'workflow_steps' }, config));
  }

  public postSteps(workflow_id: number, data): Observable<any> {
    return this._fsApi.post(`workflows/${workflow_id}/steps`, data, { key: 'workflow_step' });
  }

  public putSteps(workflow_id: number, data): Observable<any> {
    return this._fsApi.put(`workflows/${workflow_id}/steps/${data.id}`, data, { key: 'workflow_step' });
  }

  public deleteSteps(workflow_id: number, data): Observable<any> {
    return this._fsApi.delete(`workflows/${workflow_id}/steps/${data.id}`, data, { key: 'workflow_step' });
  }

  public saveSteps(workflow_id: number, data): Observable<any> {
    if (data.id) {
      return this.putSteps(workflow_id, data);
    }
    return this.postSteps(workflow_id, data);
  }

  public getStepPaths(workflow_id: number, step_id: number, data):Observable<any> {
    return this._fsApi.get(`workflows/${workflow_id}/steps/${step_id}/paths`, data, { key: 'workflow_paths' });
  }

  public getStepPath(workflow_id: number, step_id: number, path_id: number, data):Observable<any> {
    return this._fsApi.get(`workflows/${workflow_id}/steps/${step_id}/paths/${path_id}`, data, { key: 'workflow_path' });
  }

  public postStepPaths(workflow_id: number, step_id: number, data): Observable<any> {
    return this._fsApi.post(`workflows/${workflow_id}/steps/${step_id}/paths`, data, { key: 'workflow_path' });
  }

  public putStepPaths(workflow_id: number, step_id: number, data): Observable<any> {
    return this._fsApi.put(`workflows/${workflow_id}/steps/${step_id}/paths/${data.id}`, data, { key: 'workflow_path' });
  }

  public deleteStepPaths(workflow_id: number, step_id: number, data): Observable<any> {
    return this._fsApi.delete(`workflows/${workflow_id}/steps/${step_id}/paths/${data.id}`, data, { key: 'workflow_path' });
  }

  public saveStepPaths(workflow_id: number, step_id: number, data): Observable<any> {
    if (data.id) {
      return this.putStepPaths(workflow_id, step_id, data);
    }
    return this.postStepPaths(workflow_id, step_id, data);
  }

  public orderPath(workflow_id: number, step_id: number, data): Observable<any> {
    return this._fsApi.put(`workflows/${workflow_id}/steps/${step_id}/paths/order `, data, { key: null });
  }

  public getPathAction(workflow_id: number, step_id: number, path_id: number, action_id: number, data): Observable<any> {
    return this._fsApi.get(`workflows/${workflow_id}/steps/${step_id}/paths/${path_id}/actions/${action_id}`, data, { key: 'workflow_action' });
  }

  public postPathAction(workflow_id: number, step_id: number, path_id: number, data): Observable<any> {
    return this._fsApi.post(`workflows/${workflow_id}/steps/${step_id}/paths/${path_id}/actions`, data, { key: 'workflow_action' });
  }

  public putPathAction(workflow_id: number, step_id: number, path_id: number, data): Observable<any> {
    return this._fsApi.put(`workflows/${workflow_id}/steps/${step_id}/paths/${path_id}/actions/${data.id}`, data, { key: 'workflow_action' });
  }

  public deletePathAction(workflow_id: number, step_id: number, path_id: number, data): Observable<any> {
    return this._fsApi.delete(`workflows/${workflow_id}/steps/${step_id}/paths/${path_id}/actions/${data.id}`, data, { key: 'workflow_action' });
  }

  public savePathAction(workflow_id: number, step_id: number, path_id: number, data): Observable<any> {
    if (data.id) {
      return this.putPathAction(workflow_id, step_id, path_id, data);
    }
    return this.postPathAction(workflow_id, step_id, path_id, data);
  }

  public orderActions(workflow_id: number, step_id: number, path_id: number, data): Observable<any> {
    return this._fsApi.put(`workflows/${workflow_id}/steps/${step_id}/paths/${path_id}/actions/order `, data, { key: null });
  }

  public setDefault(workflow_id: number, data = {}): Observable<any> {
    return this._fsApi.put(`workflows/${workflow_id}/default`, data, { key: 'workflow' });
  }
}
