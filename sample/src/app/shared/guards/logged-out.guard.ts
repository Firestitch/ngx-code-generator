import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { SessionService } from 'app/core/services/session.service';


@Injectable()
export class LoggedOutGuard implements CanActivate {

  constructor(private _router: Router,
              private _sessionService: SessionService) {
  }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    if (this._sessionService.isExpired()) {
      return true;
    }

    return this._router.createUrlTree(['/']);
  }
}
