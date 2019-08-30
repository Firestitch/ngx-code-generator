import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';

import { filter } from 'rxjs/operators';

import { ObjectService } from 'app/core';
import { Task } from '@app/shared/interfaces';
import { State,  } from '@app/shared/enums';
import { TimeEntryDialogComponent } from '../time-entry-dialog/time-entry-dialog.component';
import { TimeEntryData, TimeEntryType, TimeEntryState, TimeEntry } from '@app/time-entry';


@Component({
  selector: 'app-timer-recent',
  templateUrl: './timer-recent.component.html',
  styleUrls: ['./timer-recent.component.scss']
})
export class TimerRecentComponent implements OnInit {

  @Input() public timeEntry: TimeEntry = null;
  @Input() public mode: TimeEntryType = null;

  @Output() public start: EventEmitter<TimeEntry> = new EventEmitter<TimeEntry>();
  @Output() public manual: EventEmitter<TimeEntry> = new EventEmitter<TimeEntry>();
  @Output() public proceedTask: EventEmitter<Task> = new EventEmitter<Task>();
  @Output() public changeTimeEntry: EventEmitter<TimeEntry> = new EventEmitter<TimeEntry>();

  constructor(
    private _timeEntryData: TimeEntryData,
    private _objectService: ObjectService,
    private _router: Router,
    private _dialog: MatDialog
  ) { }

  public ngOnInit() {
  }

  public onProceedTask() {
    this._objectService.navigate(this.timeEntry.task);
    this.proceedTask.emit(this.timeEntry.task);
  }

  public onUpdateTimeEntry() {
    this.changeTimeEntry.emit(this.timeEntry);

    const dialogRef = this._dialog.open(TimeEntryDialogComponent, {
      data: { timeEntry: this.timeEntry }
    });

    dialogRef.afterClosed()
      .pipe(
        filter(response => !!response)
      )
      .subscribe(response => { });
  }

  public timerStart() {
    this.start.emit(this._timeEntryData.create({
      id: null,
      type: TimeEntryType.Timer,
      start_date: (new Date()).toISOString(),
      state: TimeEntryState.Running,
      description: this.timeEntry.description,
      project_id: this.timeEntry.project_id,
      task_id: this.timeEntry.task_id,
      task: this.timeEntry.task
    }));
  }

  public manualStart() {
    this.manual.emit(this._timeEntryData.create({
      id: null,
      type: TimeEntryType.Manual,
      start_date: (new Date()).toISOString(),
      state: State.Active,
      minutes: this.timeEntry.minutes,
      description: this.timeEntry.description,
      project_id: this.timeEntry.project_id,
      task_id: this.timeEntry.task_id,
    }));
  }

}
