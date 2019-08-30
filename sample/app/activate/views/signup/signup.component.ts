import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { FsMessage } from '@firestitch/message';

import { ActivationData, SessionService } from '@app/core';
import { Account } from '@app/shared';


@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  public account: Account = { id: null };
  public confirmPassword: string = null;
  public scope = null;

  constructor(
    private _activationData: ActivationData,
    private _sessionService: SessionService,
    private _message: FsMessage,
    private _router: Router,
    private _route: ActivatedRoute
  ) { }

  public ngOnInit() {

    if (this._route.snapshot.data.activate.error) {
      this._router.navigate(['/signin']);
    }

    this.account.guid = this._route.snapshot.params.guid;
    this.scope = this._route.snapshot.data.activate.scope;
    Object.assign(this.account, this._route.snapshot.data.activate);
  }

  public save() {
    this._activationData.activate(this.account)
      .subscribe(response => {
        this._sessionService.set(response);
        this._message.success(`Welcome, ${this.account.first_name} ${this.account.last_name}`);
        this._router.navigateByUrl(`/`);
      });
  }

}
