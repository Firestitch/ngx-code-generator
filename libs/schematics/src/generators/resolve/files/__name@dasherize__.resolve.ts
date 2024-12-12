import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';

import { RouteSubject } from '@firestitch/core';

import { toNumber } from 'lodash-es';

import { <%= classify(serviceName) %> } from '<%= relativeServicePath %>';

export const <%= name %>Resolver: ResolveFn<any>= (
  route: ActivatedRouteSnapshot,
  _: RouterStateSnapshot,
) => {
  const <%= camelize(serviceName)%> = inject(<%= classify(serviceName) %>);
  const routeSubject = new RouteSubject();

  if (!toNumber(route.params.id)) {
    return routeSubject.next({});
  }

  const query = {};

  return routeSubject
    .observe(this._<%= camelize(serviceName) %>.get(route.params.id, query));
};

