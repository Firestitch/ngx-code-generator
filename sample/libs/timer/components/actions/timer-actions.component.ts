import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';

import { FsMessage } from '@firestitch/message';
import { date } from '@firestitch/date';

import { addDays, isAfter, isEqual } from 'date-fns';

import { TimeEntryType, TimeEntry, Timer } from '@app/time-entry';


@Component({
  selector: 'app-timer-actions',
  templateUrl: './timer-actions.component.html',
  styleUrls: ['./timer-actions.component.scss']
})
export class TimerActionsComponent implements OnInit {

  @Input() public timer: Timer = null;
  @Input() public timeEntry: TimeEntry = null;
  @Input() public mode: TimeEntryType = null;
  @Input() public menuRef = null;

  @Output() public startTimer = new EventEmitter<void>();
  @Output() public stopTimer = new EventEmitter<void>();
  @Output() public createEntry = new EventEmitter<void>();
  @Output() public startDateChange = new EventEmitter<any>();

  public maxDate = null;

  private defaultStartDate = null;

  constructor(private _message: FsMessage) { }

  public ngOnInit() {
    this.defaultStartDate = this.timeEntry.start_date;
    this.maxDate = addDays(new Date(), 1).toISOString();
  }

  public onStartTimer() {
    this.startTimer.emit();
  }

  public onStopTimer() {
    this.stopTimer.emit();
  }

  public onCreateEntry() {
    this.createEntry.emit();
  }

  public onStartDateChange() {

    if (isAfter(date(this.timeEntry.start_date), new Date())) {
      this._message.error(`You can't select time in the future`);
      this.timeEntry.start_date = this.defaultStartDate;
      return;
    }

    if (!isEqual(date(this.defaultStartDate), date(this.timeEntry.start_date))) {
      this.startDateChange.emit(this.timeEntry.start_date);
      this.defaultStartDate = this.timeEntry.start_date;
    }
  }

  public close() {
    this.menuRef.close();
  }

}
