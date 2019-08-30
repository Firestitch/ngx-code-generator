import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FsApi } from '@firestitch/api';
import { Account } from '../../shared/interfaces';


@Injectable()
export class AccountData {

  constructor(private _api: FsApi) { }

  public create(data: Account = { id: null }) {
    data = Object.assign({ image: {}, address: {}, phone: null }, data);
    return data;
  }

  public get(account_id, data: any = {}): Observable<any> {
    return this._api.get(`accounts/${account_id}`, data, { key: 'account' });
  }

  public gets(data = {}, config = {}): Observable<any> {
    return this._api.request(`GET`, `accounts`, data, Object.assign({ key: 'accounts' }, config));
  }

  public put(account, config = {}): Observable<any> {
    return this._api.put(`accounts/${account.id}`, account, Object.assign({ key: 'account' }, config));
  }

  public save(data): Observable<any> {
    if (data.id) {
      return this.put(data);
    }
    return this.post(data);
  }

  public post(account): Observable<any> {
    return this._api.post(`accounts`, account, { key: 'account' });
  }

  public delete(account): Observable<any> {
    return this._api.delete(`accounts/${account.id}`, account, { key: 'account' });
  }

  public image(account, file): Observable<any> {
    return this._api.post(`accounts/${account.id}/image`, { file: file }, { key: 'account' });
  }

  public putPasswordChange(account, config = {}): Observable<any> {
    return this._api.put(`accounts/${account.id}/password/change`, account, Object.assign({ key: 'account' }, config));
  }

  public putPasswordReset(account, config = {}): Observable<any> {
    return this._api.put(`accounts/${account.id}/password/reset`, account, Object.assign({ key: 'account' }, config));
  }

  public getInvites(id, data: any = {}): Observable<any> {
    return this._api.get(`accounts/invites/${id}`, data, { key: 'account_request' });
  }

  public getsInvites(data, config = {}): Observable<any> {
    return this._api.request(`GET`, `accounts/invites`, data, Object.assign({ key: 'account_requests' }, config));
  }

  public postInvites(data): Observable<any> {
    return this._api.post(`accounts/invites`, data, { key: 'account_request' });
  }

  public resendInvite(account_invite_id: number): Observable<any> {
    return this._api.post(`accounts/invites/${account_invite_id}/resend`, null, { key: 'account_request' });
  }
  public deleteInvites(data): Observable<any> {
    return this._api.delete(`accounts/invites/${data.id}`, data, { key: 'account_request' });
  }

  public activate(account_id, data: any = {}): Observable<any> {
    return this._api.post(`accounts/${account_id}/activation/activate`, data, { key: 'account' });
  }

  public emailActivation(account_id, data: any = {}): Observable<any> {
    return this._api.post(`accounts/${account_id}/activation/email`, data, { key: 'account' });
  }

  public undelete(account_id, data: any = {}): Observable<any> {
    return this._api.post(`accounts/${account_id}/undelete`, data, { key: 'account' });
  }

  public createAccount(data: any = {}): Observable<any> {
    return this._api.post(`accounts/activations`, data, { key: 'account_request' });
  }

  public getEnvironments(account_id: number, data = {}): Observable<any> {
    return this._api.request(`GET`, `accounts/${account_id}/environments`, data, Object.assign({ key: 'environments' }));
  }

  public getSocialAccounts(account_id: number, data = {}): Observable<any> {
    return this._api.request(`GET`, `accounts/${account_id}/socialaccounts`, data, Object.assign({ key: 'social_accounts' }));
  }

  public postSocialAccounts(account_id: number, data = {}): Observable<any> {
    return this._api.request(`POST`, `accounts/${account_id}/socialaccounts`, data, Object.assign({ key: 'social_account' }));
  }

  public deleteSocialAccounts(account_id: number, data = {}): Observable<any> {
    return this._api.request(`DELETE`, `accounts/${account_id}/socialaccounts`, data, Object.assign({ key: 'social_account' }));
  }
}
