import { Component, Inject, OnDestroy, OnInit } from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { list as fsList } from '@firestitch/common';

import { TaskData } from 'app/core';
import { Task, Account } from 'app/shared/interfaces';


@Component({
  selector: 'task-manage-subscriptions',
  templateUrl: './task-manage-subscriptions.component.html',
  styleUrls: ['./task-manage-subscriptions.component.scss']
})
export class TaskManageSubscriptionsComponent implements OnInit, OnDestroy {
  public task: Task = null;

  private _destroy$ = new Subject();

  constructor(
    private _dialogRef: MatDialogRef<TaskManageSubscriptionsComponent>,
    private _taskData: TaskData,
    @Inject(MAT_DIALOG_DATA) public data,
  ) { }

  public ngOnInit() {
    this.task = this.data;

    this._taskData.getTaskSubscribers(this.task)
      .pipe(
        takeUntil(this._destroy$)
      )
      .subscribe((response) => {
        this.task.subscribers = response.subscribers;
      })

  }

  public ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public subscribersChanged(subscribers: Account[]) {
    this.task.subscribers = subscribers;
  }

  public save() {
    const subscribers = fsList(this.task.subscribers, 'id');
    this._taskData.saveTaskSubscribers(this.task, subscribers)
      .pipe(
        takeUntil(this._destroy$)
      )
      .subscribe((response) => {
        this.close();
      })
  }

  public close() {
    this._dialogRef.close(this.task.subscribers);
  }

}
