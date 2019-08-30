import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { of } from 'rxjs';

import { FsMessage } from '@firestitch/message';

import { StatusData } from '@app/core';
import { Status } from '@app/shared';


@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss']
})
export class StatusComponent implements OnInit {

  public status: Status = null;

  constructor(
    private _dialogRef: MatDialogRef<StatusComponent>,
    private _message: FsMessage,
    private _statusData: StatusData,
    @Inject(MAT_DIALOG_DATA) public data
  ) { }

  public ngOnInit() {
    (this.data.status.id ? this._statusData.get(this.data.status.id) : of(this.data.status))
      .subscribe(response => this.status = Object.assign({}, this._statusData.create(response)));
  }

  public save() {
    this._statusData.save(this.status)
      .subscribe(response => {
        this._message.success('Saved Changes');
        this.close(response);
      });
  }

  public close(data = null) {
    this._dialogRef.close(data);
  }

}
