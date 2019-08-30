import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { InviteData, SessionService } from '@app/core';
import { Account } from '@app/shared';
import { InviteService } from 'app/core';


@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  public account: Account = { id: null };
  public confirmPassword: string = null;
  public authToken;
  public idToken;
  public type = 'email';
  public guid;
  public scope: string = null;
  public image = '/assets/logo.png';

  constructor(
    private _inviteData: InviteData,
    private _sessionService: SessionService,
    private _route: ActivatedRoute,
    private _inviteService: InviteService
  ) { }

  public ngOnInit() {
    this.guid = this._route.snapshot.params.guid;

    this.account.email = this._route.snapshot.queryParams.email || null;
    this.account.first_name = this._route.snapshot.queryParams.first_name;
    this.account.last_name = this._route.snapshot.queryParams.last_name;
    this.authToken = this._route.snapshot.queryParams.authToken;
    this.idToken = this._route.snapshot.queryParams.idToken;
    this.type = this._route.snapshot.queryParams.type;

    this.scope = this._route.snapshot.data.invite.scope;
    this.image = this._route.snapshot.data.invite.image;
  }

  public processSession(session) {
    this._sessionService.set(session);
    this._inviteService.completeInvite(session.account, this.scope);
  }

  public continue() {

    if (this.type === 'email') {

      this._inviteData.signupEmail(this.guid, this.account)
      .subscribe(response => {
        this.processSession(response);
      });

    } else if (this.type === 'facebook') {

      this._inviteData.signupFacebook(this.guid, this.authToken, this.account)
      .subscribe(response => {
        this.processSession(response);
      });

    } else if (this.type === 'google') {

      this._inviteData.signupGoogle(this.guid, this.idToken, this.authToken, this.account)
      .subscribe(response => {
        this.processSession(response);
      });
    }
  }
}
