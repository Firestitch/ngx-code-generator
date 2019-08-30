import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';

import { FsMessage } from '@firestitch/message';

import { Observable } from 'rxjs';

import { ActivationData } from '@app/core';


@Injectable()
export class ActivateResolve implements Resolve<any> {

  constructor(private _activationData: ActivationData) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {

    return Observable.create(observer => {

      this._activationData.valid({ guid: route.params.guid }, { handleError: false })
        .subscribe(
          response => {
            observer.next(response);
            observer.complete();
          },
          error => {
            observer.next(error);
            observer.complete();
          }
        );
    });
  }

}
