
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

import { WorkflowData } from '@app/core';
import { RouteSubject } from '@firestitch/core';


@Injectable()
export class WorkflowResolve implements Resolve<any> {

  public constructor(private _workflowData: WorkflowData) {}

  resolve(route: ActivatedRouteSnapshot) {
    const routeSubject = new RouteSubject();

    if (!route.params.workflow_id) {
      return routeSubject.next(this._workflowData.create());
    }

    return routeSubject.observe(this._workflowData.get(route.params.workflow_id));
  }
}
