import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { FsMessage } from '@firestitch/message';

import { AccountData, SessionService } from '@app/core';
import { Account } from '@app/shared';


@Component({
  templateUrl: './password-change.component.html',
  styleUrls: ['./password-change.component.scss']
})
export class PasswordChangeComponent {

  public password: string = null;

  public account: Account = null;

  public config;

  constructor(
    private _accountData: AccountData,
    private _sessionService: SessionService,
    private _message: FsMessage,
    private _router: Router,
    private _route: ActivatedRoute
  ) {
    this.config = {
      minLength: 6,
      enableCurrentPassword: false,
      exclude: ['password']
    };

    this.account = this._sessionService.account();
  }

  public save() {
    this._accountData.putPasswordReset({
      id: this.account.id,
      password: this.password,
      change_password: false,
      email_password: false
    })
      .subscribe(resp => {
        this.account.password_change = false;
        this._sessionService.account(this.account);
        const redirect = this._route.snapshot.queryParams.redirect || '/';
        this._router.navigateByUrl(redirect);
        this._message.success(`Welcome back ${this.account.first_name} ${this.account.last_name}`);
      });
  }

}
