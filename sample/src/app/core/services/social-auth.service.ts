import { Injectable, NgZone } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { environment } from '../../../environments/environment';

import { AuthService, FacebookLoginProvider, GoogleLoginProvider } from 'angularx-social-login';

@Injectable()
export class SocialAuthService {

  constructor(
    private _ngZone: NgZone,
    private _socialAuthService: AuthService) {}

  public googleSignin(): Observable<any> {
    if (this.getGooglePlugin()) {
      return this.googleMobileLogin();
    } else {
      return this.webLogin(GoogleLoginProvider.PROVIDER_ID);
    }
  }

  public facebookSignin(): Observable<any> {
    if (this.getFacebookPlugin()) {
      return this.facebookMobileLogin();
    } else {
      return this.webLogin(FacebookLoginProvider.PROVIDER_ID);
    }
  }

  public logout() {
    if (this.getFacebookPlugin()) {
      this.getFacebookPlugin().logout();
    }

    if (this.getGooglePlugin()) {
      this.getGooglePlugin().logout();
    }

    this._socialAuthService.signOut().then( resp => {

    });
  }

  private facebookMobileLogin(): Observable<any> {
    return Observable.create(observer => {
      this.getFacebookPlugin().login(
        ['public_profile', 'email'],
        this.handleFacebookMobileSuccessResponse.bind(this, observer),
        this.handleErrorResponse.bind(this, observer));
    })
  }

  private googleMobileLogin(): Observable<any> {
    return Observable.create(observer => {
      this.getGooglePlugin().login(
        {
          webClientId: environment.googleClientId,
          offline: true
        },
        this.handleGoogleMobileSuccessResponse.bind(this, observer),
        this.handleErrorResponse.bind(this, observer)
      );
    })
  }

  private handleErrorResponse(observer: Observer<any>, response): void {
    this._ngZone.run(() => {
      observer.error(response);
      observer.complete();
    });
  }

  private handleFacebookMobileSuccessResponse(observer: Observer<any>, response): void {
    this._ngZone.run(() => {
      if (response.authResponse && response.authResponse.accessToken) {
        observer.next({ accessToken: response.authResponse.accessToken });
      } else {
        observer.error('Could not get token from facebook.');
      }

      observer.complete();
    });
  }

  private handleGoogleMobileSuccessResponse(observer: Observer<any>, response): void {
    this._ngZone.run(() => {
      if (response.accessToken && response.idToken) {
        observer.next({ idToken: response.idToken, accessToken: response.accessToken });
      } else {
        observer.error('Could not get token from google.');
      }

      observer.complete();
    });
  }

  private getFacebookPlugin() {
    return (<any>window).facebookConnectPlugin;
  }

  private getGooglePlugin() {
    return (<any>window).plugins && (<any>window).plugins.googleplus;
  }

  private webLogin(platform): Observable<any> {
    return Observable.create(observer => {

      this._socialAuthService.signIn(platform).then(
        resp => {
          this._ngZone.run(() => {
            observer.next(resp);
            observer.complete();
          })
        },
        error => { this.handleErrorResponse(observer, error) }
      );
    })
  }
}
