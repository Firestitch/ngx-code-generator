import { Injectable } from '@angular/core';
import { Router, DefaultUrlSerializer } from '@angular/router';

import { FsStore } from '@firestitch/store';



@Injectable()
export class SigninService {

  private readonly SigninRedirect = 'signin_redirect';

  constructor(
    private _router: Router,
    private _store: FsStore
  ) {}

  public createSigninUrlTree() {
    this._setRedirectUrl();
    return this._router.createUrlTree(['/signin']);
  }

  public redirectSignin() {
    this._setRedirectUrl();
    this._router.navigateByUrl('/signin');
  }

  public processRedirect() {
    const redirectUrl = this._store.get(this.SigninRedirect);
    this._store.remove(this.SigninRedirect);
    redirectUrl ? this._router.navigateByUrl(new DefaultUrlSerializer().parse(redirectUrl)) : this._router.navigateByUrl('/');
  }

  private _setRedirectUrl() {

    const location = window.location;
    let redirect = '/signin';

    if (!location.pathname.match(/\/signin/i)) {
      redirect = location.pathname.concat(location.search);
    }

    this._store.set(this.SigninRedirect, redirect);
  }
}
