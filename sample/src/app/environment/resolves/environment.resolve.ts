import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

import { RouteSubject } from '@firestitch/core';

import { EnvironmentData } from 'app/core';


@Injectable()
export class EnvironmentResolve implements Resolve<any> {

  constructor(private _environmentData: EnvironmentData) {}

  public resolve(route: ActivatedRouteSnapshot) {
    const routeSubject = new RouteSubject();
    if (!route.params.id) {
      return routeSubject.next({});
    }
    return routeSubject.observe(this._environmentData.get(route.params.id));
  }
}
