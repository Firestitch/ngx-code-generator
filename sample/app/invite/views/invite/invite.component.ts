import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { FsMessage, MessageMode } from '@firestitch/message';

import { InviteData, SocialAuthService, AuthService, SessionService } from '@app/core';
import { InviteService } from 'app/core';


@Component({
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.scss']
})
export class InviteComponent implements OnInit {

  public invite = null;
  public image = '/assets/logo.png';

  constructor(
    private _inviteData: InviteData,
    private _inviteService: InviteService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _socialAuthService: SocialAuthService,
    private _authService: AuthService,
    private _sessionService: SessionService,
    private _message: FsMessage
  ) { }

  ngOnInit(): void {
    this.invite = this._route.snapshot.data.invite;
    this.image = this._route.snapshot.data.invite.image;

    if (this.invite.error) {
      this.processInviteError(this.invite.error);
    }
  }

  public save() {
    this._inviteData.email({ guid: this._route.snapshot.params.guid, email: this.invite.email })
    .subscribe(exists => {
      if (exists) {
        this._router.navigate(['/invite/signin', this._route.snapshot.params.guid]);
      } else {
        this._router.navigate(['/invite/signup', this._route.snapshot.params.guid], {
          queryParams: { type: 'email', email: this.invite.email }
        });
      }
    });
  }

  public continueFacebook() {
    this._socialAuthService.facebookSignin().subscribe(
      data => {
        this._authService.siginFacebook(data.authToken, { handleError: false })
        .subscribe(
          response => this.processSocial(response),
          response => this.processSocialError(response, data));
      }
    );
  }

  public continueGoogle() {
    this._socialAuthService.googleSignin().subscribe(
      data => {
        this._authService.signinGoogle(data.idToken, data.authToken, { handleError: false })
          .subscribe(
            response => this.processSocial(response),
            response => this.processSocialError(response, data));
      }
    );
  }

  private processSocial(session) {
    this._sessionService.set(session);

    this._inviteData.token({
      guid: this.invite.guid
    })
    .subscribe(response => {
      this._inviteService.completeInvite(session.account, this.invite.scope);
    }, () => {
      this._router.navigate(['/']);
    });
  }

  private processInviteError(error) {

    if (error.code === 460) {
      this._message.info(error.message,
      {
        mode: MessageMode.Dialog,
        buttons: [
          {
            label: 'Ok',
            color: 'primary',
            click: () => {
              this._router.navigate(['/signin']);
            }
          },
          {
            label: 'Send New Invitation',
            click: () => {
              this._inviteData.resend({ guid: this._route.snapshot.params.guid })
              .subscribe(() => {
                this._message.success('A new invitation has been sent to your email. Please check your inbox.');
                this._router.navigate(['/signin']);
              });
            }
          }
        ]
      });
    }

    if (error.code === 450) {
      this._message.error(error.message,
      {
        mode: MessageMode.Dialog,
        buttons: [
          {
            label: 'Ok',
            color: 'primary',
            click: () => {
              this._router.navigate(['/signin']);
            }
          }
        ]
      });
    }
  }

  private processSocialError(response, token) {

    if (response.status === 570) {
      const data = response.error.data;
      const queryParams = {
        type: data.type,
        idToken: token.idToken,
        authToken: token.authToken,
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name
      };

      this._router.navigate(['/invite/signup', this._route.snapshot.params.guid ], { queryParams: queryParams });
    } else {
      this._message.error('There was an unknown error');
    }
  }
}
