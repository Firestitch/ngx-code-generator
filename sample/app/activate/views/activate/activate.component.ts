import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { FsMessage } from '@firestitch/message';

import { ActivationData } from '@app/core';


@Component({
  templateUrl: './activate.component.html',
  styleUrls: ['./activate.component.scss']
})
export class ActivateComponent implements OnInit {

  public activate = null;

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _activationData: ActivationData,
    private _message: FsMessage
  ) { }

  public ngOnInit() {
    this.activate = this._route.snapshot.data.activate;

    if (!this.activate.error) {
      this._router.navigate(['/activation', 'signup', this._route.snapshot.params.guid]);
    }
  }

  public sendLink() {
    this._activationData.resend({ guid: this._route.snapshot.params.guid})
      .subscribe(() => {
        this._message.success('A new activation link has been sent to your email. Please check your inbox.');
        this._router.navigate(['/signup']);
      });
  }

}
