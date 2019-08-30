import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';

import { FsMessage } from '@firestitch/message';

import { Observable } from 'rxjs';

import { InviteData } from '@app/core';


@Injectable()
export class InviteResolve implements Resolve<any> {

  constructor(
    private _inviteData: InviteData) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {

    return Observable.create(observer => {

      this._inviteData.valid({ guid: route.params.guid }, { handleError: false })
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
