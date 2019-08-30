import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { of } from 'rxjs';

import { FsMessage } from '@firestitch/message';

import { TimeEntryData, TimeEntryType, TimeEntry } from '@app/time-entry';


@Component({
  selector: 'app-time-entry-dialog',
  templateUrl: './time-entry-dialog.component.html',
  styleUrls: ['./time-entry-dialog.component.scss']
})
export class TimeEntryDialogComponent implements OnInit {

  public timeEntry: TimeEntry = null;

  constructor(
    private _dialogRef: MatDialogRef<TimeEntryDialogComponent>,
    private _fsMessage: FsMessage,
    private _timeEntryData: TimeEntryData,
    @Inject(MAT_DIALOG_DATA) public data
  ) { }

  public ngOnInit() {
    (
      this.data.timeEntry.id ?
      this._timeEntryData.get(this.data.timeEntry.id, { tasks: true, accounts: true }) :
      of(Object.assign(this.data.timeEntry, { type: TimeEntryType.Manual }))
    )
      .subscribe(response => this.timeEntry = Object.assign({}, this._timeEntryData.create(response)));
  }

  public save() {
    const data = Object.assign({}, this.timeEntry);

    switch (data.type) {
      case TimeEntryType.Timer:
        delete(data.minutes);
        break;
      case TimeEntryType.Manual:
        delete(data.end_date);
        break;
    }

    this._timeEntryData.save(data)
      .subscribe(response => {
        this._fsMessage.success(`Saved Changes`);
        this.close(data);
      });
  }

  public close(data = null) {
    this._dialogRef.close(data);
  }

}
