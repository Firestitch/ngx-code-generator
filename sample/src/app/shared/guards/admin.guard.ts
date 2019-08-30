import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot, CanActivate, Router,
  RouterStateSnapshot
} from '@angular/router';
import { AclQueryService } from '@app/core/services/acl-query.service';
import { FsMessage } from '@firestitch/message';

@Injectable()
export class AdminGuard implements CanActivate {

  constructor(private _aclQueryService: AclQueryService,
              private _router: Router,
              private _message: FsMessage) {
  }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    if (this._aclQueryService.hasPermissionApp()) {
      return true;
    }

    this._message.error('Sorry, but you haven\'t permission for this page', { mode: 'toast' });
    return this._router.createUrlTree(['/']);
  }
}
