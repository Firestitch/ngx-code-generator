import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

import { FsMessage } from '@firestitch/message';

import { Account } from '../../shared/interfaces';
import { SigninService } from 'app/core/services/signin.service';
import { SessionService } from 'app/core/services/session.service';


@Injectable()
export class LoggedInGuard implements CanActivate {

  constructor(
    private _jwtHelper: JwtHelperService,
    private _router: Router,
    private _sessionService: SessionService,
    private _message: FsMessage,
    private _signinService: SigninService
  ) { }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    if (this._sessionService.isExpired()) {

      if (this._sessionService.hasToken()) {
        this._message.error('Your session has expired. Please signin again.', { mode: 'toast' });
      }

      return this._signinService.createSigninUrlTree();
    }

    const account: Account = this._sessionService.account();

    if (account && account.password_change) {
      this._router.navigate(['/signin/passwordchange'], { queryParams: { redirect: state.url } });
      return false;
    }

    return true;
  }

}
