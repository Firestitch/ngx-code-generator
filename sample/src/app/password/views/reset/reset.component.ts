import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { FsMessage } from '@firestitch/message';

import { PasswordData } from '../../data';


@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss']
})
export class ResetComponent implements OnInit {

  public password: string = null;
  public confirm_password: string = null;
  public code: string = null;
  public hasCode = false;
  public config = { enableCurrentPassword: false };

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _password: PasswordData,
    private _message: FsMessage) {
  }

  public ngOnInit() {
    this.code = this._route.snapshot.params.code || null;
    this.hasCode = !!this.code;
  }

  public compare() {
    return null;
  }

  public reset() {

    this._password.reset({
      code: this.code,
      password: this.password,
      confirm_password: this.password
    })
      .subscribe(() => {
        this._router.navigateByUrl('/signin');
        this._message.success(`Your password has been successfully changed`);
      });
  }
}
