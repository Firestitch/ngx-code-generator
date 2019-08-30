import { Component} from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';

import { FsMessage } from '@firestitch/message';

import { AuthService, SocialAuthService, SignupService, MessageService } from '@app/core';
import { ContentWidgetDialogComponent } from '../../components';


@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {

  public email: string;
  public password: string;

  constructor(
    private _message: FsMessage,
    private _router: Router,
    private _authService: AuthService,
    private _signupService: SignupService,
    private _socialAuthService: SocialAuthService,
    private _dialog: MatDialog,
    private _messageService: MessageService,
  ) { }

  signupEmail() {
    this._signupService.validatetEmail(this.email).subscribe(response => {
      if (response && response.exists === true) {
        this._message.error('Email is already being used by another account');
      } else {
        this._router.navigate(['/signup/profile'], { queryParams: { email: this.email } });
      }
    });
  }

  signupFacebook() {
    this._socialAuthService.facebookSignin().subscribe(
      data => {
        this._authService.siginFacebook(data.authToken, { handleError: false })
        .subscribe(
          response => this._authService.processSignin(response),
          response => this.processSocialError(response, data));
      }
    );
  }

  terms() {
    this._dialog.open(ContentWidgetDialogComponent, {
      width: '600px',
      data: {
        title: 'Terms of Service',
        tag: 'terms_of_service'
      }
    });
  }

  privacy() {
    this._dialog.open(ContentWidgetDialogComponent, {
      width: '600px',
      data: {
        title: 'Privacy Policy',
        tag: 'privacy_policy'
      }
    });
  }

  signupGoogle() {
    this._socialAuthService.googleSignin().subscribe(
      data => {
        this._authService.signinGoogle(data.idToken, data.authToken, { handleError: false })
          .subscribe(
            response => this._authService.processSignin(response),
            response => this.processSocialError(response, data));
      }
    );
  }

  private processSocialError(response, token) {

    if (response.status === 570) {
      const data = response.error.data;
      const queryParams = { type: data.type,
                            idToken: token.idToken,
                            authToken: token.authToken,
                            email: data.email,
                            first_name: data.first_name,
                            last_name: data.last_name };

      this._router.navigate(['signup/profile'], { queryParams: queryParams });
    } else {
      this._messageService.showApiResponseErrorMessages(response);
    }
  }
}
