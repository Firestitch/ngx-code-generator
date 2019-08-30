import { Component, Input, OnDestroy } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AccountData, SocialAuthService } from '@app/core';


@Component({
  selector: 'app-account-social',
  templateUrl: './account-social.component.html',
  styleUrls: ['./account-social.component.scss']
})
export class AccountSocialComponent implements OnDestroy {

  @Input('accountId')
  set setAccountId(account_id) {
    this.account_id = account_id;
    this.socialAccounts = { facebook: {}, google: {} };

    if (this.account_id) {
      this._accountData.getSocialAccounts(this.account_id)
      .pipe(
        takeUntil(this._destroy$)
      )
      .subscribe(response => {
        response.forEach(socialAccount => {
          this.socialAccounts[socialAccount.type].enabled = true;
          this.socialAccounts[socialAccount.type].email = socialAccount.email;
        });
      });
    }
  }

  @Input() allowEdit = false;
  public account_id: number = null;
  public socialAccounts: any = {};

  private _destroy$ = new Subject();

  constructor(
    private _accountData: AccountData,
    private _socialAuthService: SocialAuthService
  ) { }

  public toggleSocialChange(type) {

    if (this.socialAccounts[type].enabled) {

      // HACK: to uncheck the toggle. Only after the connection is made do we activate the toggle
      setTimeout(() => {
        this.socialAccounts[type].enabled = false;
      });

      if (type === 'facebook') {
        this._socialAuthService.facebookSignin()
        .pipe(
          takeUntil(this._destroy$)
        )
        .subscribe(
          data => {
            this.addSocialAccount({ access_token: data.authToken }, type);
          });
      }

      if (type === 'google') {
        this._socialAuthService.googleSignin()
        .pipe(
          takeUntil(this._destroy$)
        )
        .subscribe(
          data => {
            this.addSocialAccount({ id_token: data.idToken, access_token: data.authToken }, type);
          });
      }
    } else {
      this.deleteSocialAccount(type);
    }
  }

  private addSocialAccount(data, type) {
    data.type = type;
    this._accountData.postSocialAccounts(this.account_id, data)
    .pipe(
      takeUntil(this._destroy$)
    )
    .subscribe(response => {
      this.socialAccounts[type].enabled = true;
      this.socialAccounts[type].email = response.email;
    });
  }

  private deleteSocialAccount(type) {

    this._accountData.deleteSocialAccounts(this.account_id, { type: type })
    .pipe(
      takeUntil(this._destroy$)
    )
    .subscribe(response => {
      this.socialAccounts[type].enabled = false;
      this.socialAccounts[type].email = null;
    });
  }

  public ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
