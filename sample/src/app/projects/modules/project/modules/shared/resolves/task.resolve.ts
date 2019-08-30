import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

import { RouteSubject } from '@firestitch/core';

import { TaskData } from '@app/core';


@Injectable()
export class TaskResolve implements Resolve<any> {

  constructor(private _taskData: TaskData) {}

  public resolve(route: ActivatedRouteSnapshot) {
    const routeSubject = new RouteSubject();
    if (!route.params.id) {
      return routeSubject.next({});
    }

    const query = {
      categories: true,
      projects: true,
      statuses: true,
      types: true,
      tags: true,
      create_accounts: true,
      modify_accounts: true,
      assigned_accounts: true,
      current_status_due: true,
      workflow_step_id: true,
    };

    return routeSubject.observe(this._taskData.get(route.params.id, query));
  }
}
