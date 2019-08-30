import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FsMessage } from '@firestitch/message';
import { FsStore } from '@firestitch/store';
import { date } from '@firestitch/date';

import { isObject, isEqual } from 'lodash-es';

import {
  TimerService,
  TimeEntryData,
  TimeEntry,
  Timer,
  TimeEntryType
} from '@app/time-entry';
import {  Task, Account } from '@app/shared/interfaces';
import { State } from '@app/shared/enums';

import { SidenavMenuRef } from '@firestitch/sidenav';


@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnInit, OnDestroy {

  @ViewChild('form') public form = null;

  public mode: TimeEntryType = TimeEntryType.Timer;

  public timeEntry: TimeEntry = null;
  public timer: Timer = null;

  public selectedTask: Task = null;

  public recentTimeEntries: TimeEntry[] = [];

  private _loggedInAccount: Account = null;

  public set submitType(value) {
    this._submitType = value;
    this.form.ngSubmit.emit();
  }

  // Manual Entry fields
  public startDate = null;
  public minutes: number = null;

  private _destroy$ = new Subject();

  private _submitType: 'start' | 'stop' | 'manual' = null;

  constructor(
    private _timerService: TimerService,
    private _timeEntryData: TimeEntryData,
    private _message: FsMessage,
    private _store: FsStore,
    private _router: Router,
    public menuRef: SidenavMenuRef<TimerComponent>,
  ) { }

  public ngOnInit() {
    this._loggedInAccount = this._store.get('account');
    this.timeEntry = this._timeEntryData.create();

    this._timerService.timer$
      .pipe(
        takeUntil(this._destroy$)
      )
      .subscribe((response: Timer) => this.populateTimer(response));

    this._timerService.timeEntryChange$
      .pipe(
        takeUntil(this._destroy$)
      )
      .subscribe(() => this.loadRecentTimeEntries());

    this.loadRecentTimeEntries();
  }

  public populateTimer(timer: Timer) {
    this.timer = timer;

    if (!timer) {
      this.timeEntry = this._timeEntryData.create();
      this.selectedTask = null;
      return;
    }

    this.timeEntry = this._timeEntryData.create(
      Object.assign({}, this.timer.time_entry, this.timeEntry)
    );

    if (
      this.selectedTask === null ||
      isObject(this.selectedTask) && !isEqual(this.selectedTask, this.timeEntry.task)
    ) {
      this.selectedTask = this.timeEntry.task || null;
    }
  }

  public close() {
    this.menuRef.close();
  }

  // Both tabs should show the same data.
  // But if we have running timer - it can be changed only from specified tab.
  public changeMode(mode) {

    if (mode === TimeEntryType.Timer && this.timer) {
      const timer: Timer = this._store.get('timer');
      this.timeEntry = timer.time_entry;
    }

    this.mode = mode;
  }

  public loadRecentTimeEntries() {
    this._timeEntryData.gets({
      account_id: this._loggedInAccount.id,
      tasks: true,
      projects: true,
      order: 'time_entry_id,DESC',
      page: 1,
      limit: 4
    })
      .subscribe(response => this.recentTimeEntries = response);
  }

  public startDateChange(startDate) {

    this._timerService.saveTimeEntry(Object.assign(this.timeEntry, {
      start_date: date(startDate).toISOString()
    }))
      .subscribe((response: TimeEntry) => this.restartTimer());
  }

  public ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public submit() {
    switch (this._submitType) {
      case 'start':
        this.startTimer();
        break;
      case 'stop':
        this.stopTimer();
        break;
      case 'manual':
        this.createEntry();
        break;
    }
  }

  public proceedTask(task: Task) {
    this.close();
  }

  public onChangeTimeEntry(data: TimeEntry) {
    this.close();
  }

  public proceedReports() {
    this.close();
    this._router.navigate(['/reports', 'timeentries'], { queryParams: { account_id: this._loggedInAccount.id }});
  }

  public projectChange() {
    this.restartTimer();
  }

  // If running timer exist - synchronize it with form data
  public restartTimer(data: TimeEntry = null) {
    data = data || this.timeEntry;

    if (this.timer && this.mode === TimeEntryType.Timer) {
      this._timerService.restart(data).subscribe(() => { });
    }
  }

  public startRecentTimer(data: TimeEntry) {
    // Stop timer if active exist
    Observable.create(observer => {
      if (this.timer) {
        this._timerService.stop(this.timeEntry)
          .subscribe(() => {
            observer.next();
            observer.complete();
          });
        return;
      }

      observer.next();
      observer.complete();
    })
      .subscribe(() => this.startTimer(data));
  }

  private startTimer(data: TimeEntry = null) {

    if (data) {
      this.timeEntry = data;
    }

    this._timerService.start(this.timeEntry)
      .subscribe(() => {
        this._message.success(`Started Timer`);
        this.close();
      });
  }

  private stopTimer() {

    this._timerService.stop(this.timeEntry)
      .subscribe((response: TimeEntry) => {
        this.timer = null;
        this.timeEntry = this._timeEntryData.create();

        switch (response.state) {
          case State.Deleted:
            this._message.error(`Entries under one minute are not tracked`, { mode: 'toast' });
            break;
          case State.Active:
            this._message.success(`Stopped Timer`);
            break;
        }

        this.close();
      });
  }

  private createEntry(data: TimeEntry = null) {

    if (!data) {
      data = this._timeEntryData.create({
        id: null,
        state: State.Active,
        type: TimeEntryType.Manual,
        start_date: this.startDate,
        minutes: this.minutes,
        description: this.timeEntry.description,
        project_id: this.timeEntry.project_id,
        task_id: this.timeEntry.task_id
      });
    }

    this._timerService.saveTimeEntry(data)
      .subscribe(response => {
        this._message.success(`Successfully created the entry`);
        this.clearForm();
      });
  }

  private clearForm() {
    Object.assign(this.timeEntry, {
      project_id: null,
      task_id: null,
      task: null,
      description: null
    });

    this.startDate = null;
    this.minutes = null;
    this.selectedTask = null;

    Object.keys(this.form.controls).forEach(control => {
      this.form.controls[control].markAsPristine();
      this.form.controls[control].markAsUntouched();
    });
  }
}
