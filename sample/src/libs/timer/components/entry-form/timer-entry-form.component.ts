import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm, ControlContainer } from '@angular/forms';

import { date } from '@firestitch/date';

import { differenceInSeconds, isAfter } from 'date-fns';

import { ProjectData, TaskData, ObjectService, AccountData } from '@app/core';
import { Project, Task, Account } from '@app/shared';
import { TimeEntry, TimeEntryType } from '@app/time-entry';


@Component({
  selector: 'app-timer-entry-form',
  templateUrl: './timer-entry-form.component.html',
  styleUrls: ['./timer-entry-form.component.scss'],
  viewProviders: [ { provide: ControlContainer, useExisting: NgForm } ]
})
export class TimerEntryFormComponent implements OnInit {

  private _timeEntry: TimeEntry = null;
  @Input() public set timeEntry (value: TimeEntry) {
    this._timeEntry = value;
    this.timeEntryChange.emit(value);
  };
  public get timeEntry(): TimeEntry {
    return this._timeEntry;
  }

  @Input() public mode: TimeEntryType = null;
  @Input() public selectedTask: Task = null;
  @Input() public showAccount = true;
  @Input() public showType = true;

  // Manual Entry fields
  @Input() public startDate = null;
  @Input() public minutes: number = null;

  public tasks: Task[] = [];

  @Output() public timeEntryChange = new EventEmitter<TimeEntry>();
  @Output() public selectedTaskChange = new EventEmitter<Task>();
  @Output() public projectChange = new EventEmitter();
  @Output() public proceedTask = new EventEmitter();
  @Output() public descriptionChange = new EventEmitter();
  @Output() public startDateChange = new EventEmitter();
  @Output() public minutesChange = new EventEmitter<number>();
  @Output() public modeChange = new EventEmitter<TimeEntryType>();

  public projects: Project[] = [];
  public selectedAccount: Account = null;
  public timerDuration: number = null;

  public displayTaskWith = (data => {

    if (!data) {
      return '';
    }
    const meta = this._objectService.objectIdentifier(data.project, data);
    return `${meta.projectAbr}-${meta.objectAbr}${meta.objectNumber} ${data.name}`;

  }).bind(this);

  public fetchAccounts = (name: string) => {
    return this._accountData.gets({ keyword: name, page: 1, limit: 10 });
  }

  public fetchTasks = (name: string) => {
    return this._taskData.gets({
      keyword: name,
      project_id: this.timeEntry.project_id,
      projects: true,
      page: 1,
      limit: 10
    });
  }

  public displayAccountWith = data => {
    return data ? `${data.first_name} ${data.last_name}` : '';
  }

  constructor(
    private _route: ActivatedRoute,
    private _ProjectData: ProjectData,
    private _taskData: TaskData,
    private _objectService: ObjectService,
    private _accountData: AccountData,
    private _router: Router
  ) { }

  public ngOnInit() {
    this._ProjectData.gets()
      .subscribe(response => {
        if (response.length) {
          this.timeEntry.project_id = this.timeEntry.project_id || response[0].id;
        }

        this.projects = response;

        if (this.timeEntry.task) {
          this.selectedTask = this.timeEntry.task;
        }

        if (this.timeEntry.account) {
          this.selectedAccount = this.timeEntry.account;
        }
      });
  }

  public onProjectChange() {
    this.onTaskChange(null);
    this.projectChange.emit();
  }

  public onProceedTask(task) {
    this._objectService.navigate(task);
    this.proceedTask.emit();
  }

  public onDescriptionChange() {
    this.descriptionChange.emit();
  }

  public onStartDateChange(value) {
    this.startDate = value;
    this.startDateChange.emit(this.startDate);
  }

  public onMinutesChange(value) {
    this.minutes = value;
    this.minutesChange.emit(this.minutes);
  }

  public onAccountChange($event) {
    this.timeEntry.account_id = $event ? $event.id : null;
    this.timeEntry.account = $event;
  }

  public onTaskChange($event) {
    this.timeEntry.task_id = $event ? $event.id : null;
    this.timeEntry.task = $event;
    this.selectedTaskChange.emit($event);
  }

  public onDatesChange() {
    this.timerDuration = null;

    if (this.timeEntry.start_date && this.timeEntry.end_date) {

      const startDate = date(this.timeEntry.start_date);
      const endDate = date(this.timeEntry.end_date);

      if (isAfter(startDate, endDate)) {
        this.timeEntry.end_date = null;
        return;
      }

      this.timerDuration = differenceInSeconds(endDate, startDate);
    }
  }

  public onModeChange($event) {
    this.mode = $event;
    this.modeChange.emit(this.mode);
  }

}
