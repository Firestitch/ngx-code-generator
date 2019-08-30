import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FsApi } from '@firestitch/api';
import { Task } from '../../shared/interfaces';

@Injectable()
export class TaskData {
  constructor(private _fsApi: FsApi) {}

  public create(data: Task = { id: null }) {
    return data;
  }

  public get(task_id: number | string, query = {}): Observable<any> {
      return this._fsApi.get(`tasks/${task_id}`, query, { key: 'task' });
  }

  public gets(data = {}, config = {}): Observable<any> {
      return this._fsApi.request('GET', 'tasks', data, Object.assign({ key: 'tasks' }, config));
  }

  public put(task: Task, config = {}): Observable<any> {
      return this._fsApi.put(`tasks/${task.id}`, task, Object.assign({ key: 'task' }, config));
  }

  public post(task: Task): Observable<any> {
      return this._fsApi.post('tasks', task, { key: 'task' });
  }

  public delete(task: Task): Observable<any> {
      return this._fsApi.delete(`tasks/${task.id}`, task, { key: 'task' });
  }

  public save(data): Observable<any> {
      if (data.id) {
      return this.put(data);
    }
    return this.post(data);
  }

  public getTaskSubscribers(task: Task, query = {}): Observable<any> {
    return this._fsApi.get(`objects/${task.id}/subscribers`, query, { key: null});
  }

  public saveTaskSubscribers(task: Task, subscribersList: number[]): Observable<any> {
    return this._fsApi.post(`objects/${task.id}/subscribers`, { account_ids: subscribersList} , { key: null });
  }

  public savePathToTask(task_id: number, data = {}): Observable<any> {
    return this._fsApi.post(`tasks/${task_id}/workflowpath`, data, { key: null })
  }

  public bulk(task_ids: number[], status_id: number, query = {}): Observable<any> {
    return this._fsApi.put(`tasks/bulk`, { task_ids, status_id }, { key: null })
  }

  public bulkDelete(task_ids: number[], query = {}): Observable<any> {
    return this._fsApi.delete(`tasks/bulk`, { task_ids }, { key: null })
  }

  public getByIdentifier(identifier: string, query = {}): Observable<any> {
    return this._fsApi.get(`tasks/`)
  }

  public subscribeUser(task_id: number, query = {}): Observable<any> {
    return this._fsApi.put(`objects/${task_id}/subscribe`, query, { key: null })
  }

  public unsubscribeUser(task_id: number, query = {}): Observable<any> {
    return this._fsApi.delete(`objects/${task_id}/subscribe`, query, { key: null })
  }
}
