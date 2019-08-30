import { Component, Inject, OnDestroy, OnInit } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { list } from '@firestitch/common';

import { TypeData, WorkflowData } from '@app/core';
import { Type, WorkflowTask, Account } from '@app/shared';


@Component({
  templateUrl: './workflow-edit-task.component.html'
})
export class WorkflowEditTaskComponent implements OnInit, OnDestroy {
  public types: Type[] = [];
  public workflowTask: WorkflowTask = null;

  private _$destroy = new Subject();

  constructor(private _typeData: TypeData,
              private _workflowData: WorkflowData,
              private _dialogRef: MatDialogRef<WorkflowEditTaskComponent>,
              @Inject(MAT_DIALOG_DATA) public data) { }

  public ngOnInit() {
    this._typeData.gets({ class: 'task' })
    .pipe(
      takeUntil(this._$destroy)
    )
    .subscribe((types) => {
      this.types = types;
    });

    this._workflowData.getTasks(this.data.workflowTask.workflow_id, this.data.workflowTask.id)
      .pipe(
        takeUntil(this._$destroy)
      )
      .subscribe( (response) => {
        this.workflowTask = response;
      });
  }

  public ngOnDestroy() {
    this._$destroy.next();
    this._$destroy.complete();
  }

  public typeChanged(type_id: number) {
    this.workflowTask.type_id = type_id;
  }

  public accountChanged(account: Account) {
    this.workflowTask.assign_account = account;
    this.workflowTask.assign_account_id = +account.id;
  }

  public subscribersChange(value: any) {
    this.workflowTask.configs = list(value, 'id');
    this.workflowTask.subscribers = value;
  }

  public save() {
    this._workflowData.putTasks(this.workflowTask.workflow_id, this.workflowTask)
      .pipe(
        takeUntil(this._$destroy)
      )
      .subscribe((response) => {
        this.close('saved');
      });
  }

  public close(action: string) {
    this._dialogRef.close({ action, taskWorflow: this.workflowTask });
  }
}
