import { Component, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

import { FsMessage } from '@firestitch/message';

import { AuthService, SocialAuthService, ApiHandler } from '@app/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MessageService } from 'app/core';


@Component({
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent {

  @ViewChild('emailInput', { read: ElementRef }) emailInput: ElementRef;
  @ViewChild('passwordInput', { read: ElementRef }) passwordInput: ElementRef;

  public email: string;
  public password: string;

  constructor(
    private _authService: AuthService,
    private _message: FsMessage,
    private _router: Router,
    private _socialAuthService: SocialAuthService,
    private _messageService: MessageService,
    public jwtHelper: JwtHelperService
  ) { }

  public signin() {
    this._authService.signin(this.email, this.password)
    .subscribe(response => this._authService.processSignin(response))
  }

  public signinFacebook() {
    this._socialAuthService.facebookSignin()
    .subscribe(
      data => {
        this._authService.siginFacebook(data.authToken, { handleError: false })
        .subscribe(
          response => this._authService.processSignin(response),
          response => this.processSocialError(response, data));
      }
    );
  }

  public signinGoogle() {
    this._socialAuthService.googleSignin()
    .subscribe(
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
      this._message.info('Hello ' +  data.first_name + '! To complete your sign up confirm your information and click continue.');
      this._router.navigate(['signup/profile'], { queryParams: queryParams });
    } else {
      this._messageService.showApiResponseErrorMessages(response);
    }
  }

  /*
    Workaround for iOS Chome Autofill where element events are not triggered and
    values are not being updated which is failing the validation
  */
  singinClick() {
    this.email = this.emailInput.nativeElement.value;
    this.password = this.passwordInput.nativeElement.value;
  }
}
