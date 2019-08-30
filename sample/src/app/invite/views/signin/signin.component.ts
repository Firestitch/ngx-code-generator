import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';;

import { InviteData, SessionService } from '@app/core';
import { InviteService } from 'app/core';


@Component({
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  public email: string = null;
  public password: string = null;
  public guid: string = null;
  public scope: string = null;
  public image = '/assets/logo.png';

  constructor(
    private _inviteData: InviteData,
    private _route: ActivatedRoute,
    private _sessionService: SessionService,
    private _inviteService: InviteService,
  ) { }

  public ngOnInit() {
    this.guid = this._route.snapshot.params.guid;
    this.email = this._route.snapshot.data.invite.email;
    this.scope = this._route.snapshot.data.invite.scope;
    this.image = this._route.snapshot.data.invite.image;
  }

  public save() {
    this._inviteData.signin({
      guid: this.guid,
      email: this.email,
      password: this.password
    })
    .subscribe(response => {
      this._sessionService.set(response);
      this._inviteService.completeInvite(response.account, this.scope);
    });
  }
}
