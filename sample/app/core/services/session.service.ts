import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

import { isBefore } from 'date-fns';

import { FsStore } from '@firestitch/store';
import { date } from '@firestitch/date';

import { Account, Environment } from '../../shared/interfaces';
import { Timer } from '@app/time-entry';


@Injectable()
export class SessionService {

  constructor(public jwtHelper: JwtHelperService,
              private _store: FsStore) {
  }

  public set(data) {
    this._store.set('token', data.token);
    this._store.set('account', data.account);
    this._store.set('permissions', data.permissions);
    this._store.set('environment', data.environment);
  }

  public destroy() {
    this._store.remove('token');
    this._store.remove('account');
    this._store.remove('permissions');
    this._store.remove('environment');
  }

  public isExpired() {
    const token = this.getToken();
    return !token || isBefore(date(token.expiry_date), new Date());
  }

  public hasToken() {
    return !!this.getToken();
  }

  public setToken(token) {
    this._store.set('token', token);
  }

  public getToken(decoded: boolean = true) {
    if (decoded) {
      try {
        if (this._store.get('token')) {
          return this.jwtHelper.decodeToken(this._store.get('token'));
        }
      } catch (e) {}

      return null;
    } else {
      return this._store.get('token');
    }
  }

  public searchRecentIds(data: number[] = null) {

    if (data) {
      this._store.set('search_recent_ids', data);
    }

    return this._store.get('search_recent_ids');
  }

  public account(data: Account = null) {

    if (data) {
      this._store.set('account', data);
    }

    return this._store.get('account');
  }

  public environment(data: Environment = null) {

    if (data) {
      this._store.set('environment', data);
    }

    return this._store.get('environment');
  }

  public timer(data: Timer = null) {

    if (data) {
      this._store.set('timer', data);
    }

    return this._store.get('timer');
  }

}
