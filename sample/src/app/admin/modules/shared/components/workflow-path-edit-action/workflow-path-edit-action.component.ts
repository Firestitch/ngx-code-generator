import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { of, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FsMessage } from '@firestitch/message';
import { list } from '@firestitch/common';

import { WorkflowData } from '@app/core';
import { Workflow, WorkflowPath, WorkflowAction } from '@app/shared';
import { WorkflowActionType } from '@app/shared';


@Component({
  templateUrl: './workflow-path-edit-action.component.html',
  styleUrls: ['./workflow-path-edit-action.component.scss']
})
export class WorkflowPathEditActionComponent implements OnInit, OnDestroy {

  public workflow: Workflow = null;
  public workflowPath: WorkflowPath = null;
  public workflowAction: WorkflowAction = null;
  public actionTypes = WorkflowActionType;

  private _$destroy = new Subject();

  constructor(
    private _dialogRef: MatDialogRef<WorkflowPathEditActionComponent>,
    private _fsMessage: FsMessage,
    private _workflowData: WorkflowData,
    @Inject(MAT_DIALOG_DATA) public data
  ) { }

  public ngOnInit() {
    this.workflowPath = this.data.workflowPath;
    this.workflow = this.data.workflow;

    (this.data.action.id
      ? this._workflowData.getPathAction(
        this.workflow.id,
        this.workflowPath.source_workflow_step_id,
        this.workflowPath.id,
        this.data.action.id,
        { related_accounts: true})
      : of(this._workflowData.createAction(this.data.action)))
      .pipe(
        takeUntil(this._$destroy)
      )
      .subscribe((response) => {
        this.workflowAction = response;
      });
  }

  public ngOnDestroy() {
    this._$destroy.next();
    this._$destroy.complete();
  }

  public subscribersChanged(accounts: Account[]) {
    this.workflowAction.subscriber_accounts = accounts;
    this.workflowAction.configs.subscriber_account_ids = list(accounts, 'id');
  }

  public assignedAccountChanged(account: Account) {
    this.workflowAction.assign_account = account;
    this.workflowAction.configs.assign_account_id = +account.id;
  }

  public save() {
    this._workflowData.savePathAction(
      this.workflow.id,
      this.workflowPath.source_workflow_step_id,
      this.workflowPath.id,
      this.workflowAction
      )
      .pipe(
        takeUntil(this._$destroy)
      )
      .subscribe(response => {
        response.subscriber_accounts = this.workflowAction.subscriber_accounts;
        response.assign_account = this.workflowAction.assign_account;
        this.workflowAction = response;
        this._fsMessage.success('Saved Changes');
        this.close('save');
      });
  }

  public remove() {
    this._workflowData.deletePathAction(
      this.workflow.id,
      this.workflowPath.source_workflow_step_id,
      this.workflowPath.id,
      { id: this.workflowAction.id }
      )
      .pipe(
        takeUntil(this._$destroy)
      )
      .subscribe(response => {
        this.close('delete');
      });
  }

  public close(action) {
    this._dialogRef.close({ action, workflowAction: this.workflowAction });
  }

}
