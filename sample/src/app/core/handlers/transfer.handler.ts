import { FsTransferHandler } from '@firestitch/transfer';
import { FsMessage } from '@firestitch/message';

import { SessionService } from '../services';


export class TransferHandler extends FsTransferHandler {

  constructor(private _message: FsMessage,
              private _sessionService: SessionService) {
    super();
  }

  begin(request) {
    const token = this._sessionService.getToken(false);

    if (token) {
      request.params.Token = 'Bearer ' + token;
    }

    this._message.info('Starting download...');
  }

  error(data, raw) {
    const message = data && data.message ? data.message : 'There was a problem with the download';
    this._message.error(message);
  }
}
