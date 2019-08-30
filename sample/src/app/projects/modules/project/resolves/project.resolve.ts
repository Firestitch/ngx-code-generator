import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

import { RouteSubject } from '@firestitch/core';

import { SessionService, ProjectData } from '@app/core';
import { State } from '@app/shared';


@Injectable()
export class ProjectResolve implements Resolve<any> {

  constructor(private _projectData: ProjectData,
              private _sessionService: SessionService) { }

  public resolve(route: ActivatedRouteSnapshot) {
    const routeSubject = new RouteSubject();
    if (!route.params.id) {
      return routeSubject.next(this._projectData.create({
        id: null,
        workspace_id: this._sessionService.environment() ? this._sessionService.environment().id : null,
      }));
    }

    const queryOptions = {
      statuses: true,
      state: [State.Active, State.Deleted]
    };

    return routeSubject.observe(this._projectData.get(route.params.id, queryOptions));
  }

}
