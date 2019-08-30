import { Component, Inject, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';

import { of, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

import { list } from '@firestitch/common';
import { FsMessage } from '@firestitch/message';
import {
  FsListComponent, FsListConfig, PaginationStrategy, ReorderPosition,
  ReorderStrategy
} from '@firestitch/list';

import { WorkflowData } from '@app/core';
import { Workflow, WorkflowPath, WorkflowAction, WorkflowStep } from '@app/shared';
import { WorkflowPathEditActionComponent } from '../workflow-path-edit-action/workflow-path-edit-action.component';
import { WorkflowActionType } from '@app/shared';


@Component({
  templateUrl: './workflow-path.component.html',
  styleUrls: ['./workflow-path.component.scss']
})
export class WorkflowPathComponent implements OnInit, OnDestroy {

  @ViewChild('pathList')
  public list: FsListComponent = null;
  public config: FsListConfig = null;

  @ViewChild('name') name;
  public workflow: Workflow = null;
  public workflowPath: WorkflowPath = null;
  public sourceWorkflowStep: WorkflowStep = null;
  public taskId: number = null;

  public actionTypes = WorkflowActionType;
  private _$destroy = new Subject();

  constructor(
    private _dialogRef: MatDialogRef<WorkflowPathComponent>,
    private _fsMessage: FsMessage,
    private _workflowData: WorkflowData,
    private _dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data
  ) { }

  public ngOnInit() {
    this.workflow = this.data.workflow;
    this.taskId = this.data.taskId;
    this.sourceWorkflowStep = this.data.sourceWorkflowStep;

    const query = {
      target_workflow_tasks: true,
      workflow_actions: true,
      workflow_action_related_accounts: true,
    };

    (this.data.workflowPath.id
    ? this._workflowData.getStepPath(
        this.workflow.id,
        this.data.workflowPath.source_workflow_step_id,
        this.data.workflowPath.id,
        query
      )
    : of(this._workflowData.createPath(this.data.workflowPath)))
    .pipe(
      takeUntil(this._$destroy)
    )
    .subscribe( (response) => {
      this.workflowPath = response;
    });

    this.initConfig();
  }

  public ngOnDestroy() {
    this._$destroy.next();
    this._$destroy.complete();
  }

  public initConfig() {
    this.config = {
      scrollable: {
        name: 'accounts-scroll',
      },
      rowActions: [
        {
          click: data => {

            return this._workflowData.deletePathAction(
              this.workflow.id,
              this.workflowPath.source_workflow_step_id,
              this.workflowPath.id,
              data
            ).pipe(
              tap(() => {
                const index = this.workflowPath.workflow_actions.findIndex((action) => {
                  return action.id === data.id
                });

                if (index !== -1) {
                  this.workflowPath.workflow_actions.splice(index, 1);
                }
              })
            );
          },
          remove: {
            title: 'Confirm',
            template: 'Are you sure you would like to delete this task?',
          },
          menu: true,
          label: 'Delete'
        }
      ],
      paging: {
        strategy: PaginationStrategy.Page,
      },
      reorder: {
        position: ReorderPosition.Left,
        strategy: ReorderStrategy.Always,
        done: (data) => {
          this.saveOrder(data);
        }
      },
      fetch: query => {
        return of({ data: this.workflowPath.workflow_actions || [] });
      }
    };
  }

  public openCreateAction(actionType: WorkflowActionType) {

    // if user tries to add an action of comment type
    if (actionType === this.actionTypes.Comment && this.workflowPath.workflow_actions.length) {
      const commentAction = this.workflowPath.workflow_actions.find((action) => {
        return action.type === this.actionTypes.Comment
      });

      // if we have a comment already
      if (commentAction) {
        this._fsMessage.error('Input Comment action already exists.' +
          ' You can only add 1 Input Comment action for this workflow path.');
        return;
      }
    }

    const action = this._workflowData.createAction(
      { type: actionType, target_workflow_task_id: this.taskId }
    );

    this.openEditAction(action)
  }

  public openEditAction(action: WorkflowAction) {


    const dialogRef = this._dialog.open(WorkflowPathEditActionComponent,
      {
        minWidth: '400px',
        width: '50%',
        data: {
          workflow: this.workflow,
          workflowPath: this.workflowPath,
          action
        }
      });

    dialogRef.afterClosed()
      .pipe(
        takeUntil(this._$destroy)
      )
      .subscribe((response) => {

      const index = this.workflowPath.workflow_actions.findIndex((act) => {
        return act.id === response.workflowAction.id
      });
      if (response.action === 'save') {
        if (index !== -1) {
          this.workflowPath.workflow_actions[index] = response.workflowAction;
        } else {
          this.workflowPath.workflow_actions.push(response.workflowAction);
        }
      }

      if (response.action === 'delete') {
        if (index !== -1) {
          this.workflowPath.workflow_actions.splice(index, 1);
        }
      }

      this.list.reload();
    });
  }

  public save() {
    this._workflowData.saveStepPaths(
      this.workflow.id,
      this.workflowPath.source_workflow_step_id,
      this.workflowPath
    )
    .pipe(
      takeUntil(this._$destroy)
    )
    .subscribe(response => {
      this.workflowPath.id = response.id;
      this.workflowPath = Object.assign(response, this.workflowPath);
      this._fsMessage.success('Saved Changes');
      this.close('save');
    });
  }

  public remove() {
    if (!this.workflowPath.id) {
      this.close('close');
      return;
    }

    this._workflowData.deleteStepPaths(
      this.workflow.id,
      this.workflowPath.source_workflow_step_id,
      this.workflowPath
    )
    .pipe(
      takeUntil(this._$destroy)
    )
    .subscribe(response => {
      this.close('delete');
    });
  }

  public close(action) {
    this._dialogRef.close({ action: action, workflowPath: this.workflowPath });
  }

  public saveOrder(data) {
    this._workflowData.orderActions(
      this.workflow.id,
      this.workflowPath.source_workflow_step_id,
      this.workflowPath.id,
      { workflow_action_ids: list(data, 'id') }
    )
    .pipe(
      takeUntil(this._$destroy)
    )
    .subscribe((response) => {
      console.log(response)
    });
  }

}
