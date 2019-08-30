import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { SignupService, AuthService } from '@app/core';


@Component({
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {

  public account: any = {};
  public type = 'email';
  public authToken = '';
  public idToken = '';

  constructor(
    private _authService: AuthService,
    private _route: ActivatedRoute,
    private _signupService: SignupService
  ) {
    this._route.queryParams.subscribe(params => {
      this.account.email = params.email || '';
      this.account.first_name = params.first_name || '';
      this.account.last_name = params.last_name || '';
      this.account.workspace_name = (this.account.first_name + ' ' + this.account.last_name).trim();
      this.type = params.type || 'email';
      this.authToken = params.authToken;
      this.idToken = params.idToken;
    });
  }

  public continue() {

    if (this.type === 'email') {
      this._signupService.postEmail(this.account)
      .subscribe(response => this._authService.processSignin(response, true));

    } else if (this.type === 'facebook') {
      this._signupService.postFacebook(this.authToken, this.account)
      .subscribe(response => this._authService.processSignin(response, true));

    } else if (this.type === 'google') {
      this._signupService.postGoogle(this.idToken, this.authToken, this.account)
      .subscribe(response => this._authService.processSignin(response, true));
    }
  }
}
