import { Router } from '@angular/router';

import { FsApiResponseHandler } from '@firestitch/api';
import { FsMessage } from '@firestitch/message';

import { SessionService, MessageService, SigninService } from '../services';


export class ApiHandler extends FsApiResponseHandler {

  readonly API_ERROR_RESOURCE_NOT_FOUND = 404;
  readonly API_ERROR_INVALID_AUTHORIZATION = 490;

  constructor(private _message: FsMessage,
              private _router: Router,
              private _signinService: SigninService,
              private _sessionService: SessionService,
              private _messageService: MessageService
  ) {
    super();
  }

  public success(event, config) {
    if (event.body.token) {
      this._sessionService.setToken(event.body.token);
    }

    event.body = event.body.data;
    if (config.key) {
      event.body = event.body[config.key];
    }
  }

  public error(event, config) {

    if (event.status === this.API_ERROR_RESOURCE_NOT_FOUND) {
      this._router.navigateByUrl('/notfound');
      return;

    } else if (event.status === this.API_ERROR_INVALID_AUTHORIZATION) {
      this._message.error('Please signin to access this page', { mode: 'toast' });

      this._sessionService.destroy();
      this._signinService.redirectSignin();

    } else {

      if (config.handleError === false) {
        return;
      }

      this._messageService.showApiResponseErrorMessages(event);
    }
  }
}
