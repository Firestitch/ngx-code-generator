import { Injectable } from '@angular/core';
import { FsMessage } from '@firestitch/message';



@Injectable()
export class MessageService {

  constructor(
    private _message: FsMessage
  ) {}

  public showApiResponseErrorMessages(response) {
    if (response.error && response.error.messages) {
      const messages = [];
      for (const message of response.error.messages) {
        messages.push(message.message);
      }

      this._message.error(messages.join('<br/>'));
    } else {
      this._message.error('Please check your network connection and try again.', { title: 'Poor Connection' });
    }
  }
}
