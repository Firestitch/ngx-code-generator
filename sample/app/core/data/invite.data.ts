import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { FsApi } from '@firestitch/api';


@Injectable()
export class InviteData {

  constructor(private _fsApi: FsApi,) { }

  public valid(data, options: any = {}): Observable<any> {
    return this._fsApi.post('invites/valid', data, Object.assign({ key: null }, options));
  }

  public email(data): Observable<any> {
    return this._fsApi.post('invites/email', data, { key: 'exists' });
  }

  public signin(data): Observable<any> {
    return this._fsApi.post('invites/signin', data, { key: null });
  }

  public signupEmail(guid, account): Observable<any> {
    return this._fsApi.post('invites/signup/email', { account: account, guid: guid }, { key: null });
  }

  public signupFacebook(guid, access_token, account): Observable<any> {
    const data = {
      access_token: access_token,
      account: account,
      guid: guid
    };
    return this._fsApi.post('invites/signup/facebook', data, { key: null });
  }

  public signupGoogle(guid, id_token, access_token, account): Observable<any> {
    const data = {
      id_token: id_token,
      access_token: access_token,
      account: account,
      guid: guid
    };
    return this._fsApi.post('invites/signup/google', data, { key: null });
  }

  public token(data): Observable<any> {
    return this._fsApi.post('invites/token', data, { key: null });
  }

  public resend(data): Observable<any> {
    return this._fsApi.post('invites/resend', data, { key: null });
  }
}

