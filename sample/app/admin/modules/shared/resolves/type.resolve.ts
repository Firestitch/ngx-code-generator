
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

import { TypeData } from '@app/core';
import { RouteSubject } from '@firestitch/core';


@Injectable()
export class TypeResolve implements Resolve<any> {

  public constructor(private _typeData: TypeData) {}

  resolve(route: ActivatedRouteSnapshot) {
    const routeSubject = new RouteSubject();

    if (!route.params.type_id) {
      return routeSubject.next(this._typeData.create());
    }

    const query = {
      object_fields: true,
      fields: true,
      field_options: true,
    };

    return routeSubject.observe(this._typeData.get(route.params.type_id, query));
  }

}
