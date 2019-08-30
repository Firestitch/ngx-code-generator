import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FsMessage } from '@firestitch/message';

import { PasswordData } from '../../data';


@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.scss']
})
export class RequestComponent implements OnInit {

  public email: string;

  constructor(
    private _password: PasswordData,
    private _router: Router,
    private _message: FsMessage
  ) {
  }

  public ngOnInit() {
  }

  public request() {

    this._password.request({ email: this.email })
      .subscribe(response => {
        this._router.navigateByUrl('/password/reset');
        this._message.success(`Instructions on how to reset your password have been sent to ${this.email}`);
      });
  }
}
