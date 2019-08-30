import { Injectable } from '@angular/core';

import { FsMessage } from '@firestitch/message';
import { SessionService } from '../services/session.service';
import { Router } from '@angular/router';


@Injectable()
export class InviteService {

  constructor(private _message: FsMessage,
              private _router: Router) { }

  public completeInvite(account, scope) {
    this._message.success(
      `Welcome, ${account.first_name} ${account.last_name}. You now have access to ${scope}`
    );
    this._router.navigateByUrl(`/`);
  }
}

