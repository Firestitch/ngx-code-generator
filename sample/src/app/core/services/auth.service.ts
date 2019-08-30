import { Injectable, Optional } from '@angular/core';
import { Router, ActivatedRoute, DefaultUrlSerializer } from '@angular/router';

import { Observable } from 'rxjs';

import { FsApi } from '@firestitch/api';
import { FsMessage } from '@firestitch/message';
import { FsStore } from '@firestitch/store';

import { SessionService } from './session.service';
import { SigninService } from './signin.service';


@Injectable()
export class AuthService {

  public loggedInAccount$: Observable<any> = this._store.observe('account');

  constructor(@Optional() private _api: FsApi,
              private _router: Router,
              private _route: ActivatedRoute,
              private _message: FsMessage,
              private _store: FsStore,
              private _signinService: SigninService,
              private _sessionService: SessionService) {
  }

  public signin(email, password): Observable<any> {
    return this.processResponse(this._api.post('auth/signin', { email: email, password: password }));
  }

  public siginFacebook(access_token, config = {}): Observable<any> {
    const data: any = { access_token: access_token };
    return this.processResponse(this._api.post('auth/facebook', data, config));
  }

  public signinGoogle(id_token, access_token, config={}): Observable<any> {
    const data: any = { id_token: id_token, access_token: access_token };
    return this.processResponse(this._api.post('auth/google', data, config));
  }

  public processResponse(observable: Observable<any>): Observable<any> {
    return new Observable(observer => {
      observable
      .subscribe(response => {
        this._sessionService.set(response);
        observer.next(response);
      },
      e => {
        observer.error(e);
      },
      () => {
        observer.complete();
      });
    });
  }

  public processSignin(response, newAccount = false) {

    this._signinService.processRedirect();

    if (newAccount) {
      this._message.success(`Welcome ${response.account.first_name} ${response.account.last_name}`);
    } else if (!response.account.password_change) {
      this._message.success(`Welcome back ${response.account.first_name} ${response.account.last_name}`);
    }
  }

  public destroy() {
    this._sessionService.destroy();
  }

  public impersonate(account_id): Observable<any> {
    return this.processResponse(this._api.post('auth/impersonate', { account_id: account_id }));
  }

  public signout() {

    this._api.post('auth/signout').subscribe();

    this.destroy();
    this._router.navigateByUrl('/signin');
  }
}
