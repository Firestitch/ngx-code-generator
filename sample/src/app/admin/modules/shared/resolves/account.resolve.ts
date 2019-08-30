
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

import { AccountData } from '@app/core';
import { RouteSubject } from '@firestitch/core';


@Injectable()
export class AccountResolve implements Resolve<any> {

  public constructor(private _accountData: AccountData) {}

  resolve(route: ActivatedRouteSnapshot) {
    const routeSubject = new RouteSubject();

    if (!route.params.id) {
      return routeSubject.next(this._accountData.create());
    }

    return routeSubject.observe(this._accountData.get(route.params.id, { addresses: true }));
  }

}
