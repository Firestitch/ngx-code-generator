import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { of, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FsMessage } from '@firestitch/message';
import {
  FsListComponent, FsListConfig, PaginationStrategy, ReorderPosition,
  ReorderStrategy
} from '@firestitch/list';
import { list, indexOf as fsIndexOf } from '@firestitch/common';

import { WorkflowData } from '@app/core';
import { Workflow, WorkflowStep, WorkflowPath, Status } from '@app/shared';


@Component({
  templateUrl: './workflow-step.component.html',
  styleUrls: ['./workflow-step.component.scss']
})
export class WorkflowStepComponent implements OnInit, OnDestroy {

  @ViewChild('pathList')
  public list: FsListComponent = null;
  public config: FsListConfig = null;

  public workflow: Workflow = null;
  public workflowStep: WorkflowStep = null;

  public statuses: Status[] = [];

  public defaultStepChanged = false;

  private _removedPaths: WorkflowPath[] = [];
  private _$destroy = new Subject();


  constructor(
    private _dialogRef: MatDialogRef<WorkflowStepComponent>,
    private _message: FsMessage,
    private _workflowData: WorkflowData,
    @Inject(MAT_DIALOG_DATA) public data
  ) { }

  public ngOnInit() {
    // Needs to clone object for correct steps view render
    this.workflow = Object.assign({}, this.data.workflow);

    const query = {
      statuses: true,
      workflow_tasks: true,
      workflow_paths: true,
    };

    this._workflowData.getSteps(this.workflow.id, this.data.workflowStep.id, query)
      .pipe(
        takeUntil(this._$destroy)
      )
      .subscribe( (response) => {
        this.workflowStep = response;
      });

    this.initConfig();
  }

  public ngOnDestroy() {
    this._$destroy.next();
    this._$destroy.complete();
  }

  public initConfig() {
    this.config = {
      rowActions: [
        {
          click: data => {
            const index = fsIndexOf(this.workflowStep.workflow_paths, { id: data.id });

            if (index !== -1) {
              this._removedPaths.push(this.workflowStep.workflow_paths[index]);
              this.workflowStep.workflow_paths.splice(index, 1);
            }

            return this._workflowData.deleteStepPaths(
              this.workflow.id,
              this.workflowStep.id,
              data
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
        return of({ data: this.workflowStep.workflow_paths });
      }
    };
  }

  public openPath(path: WorkflowPath) {
    this.close('path', path)
  }

  public save() {
    this._workflowData.saveSteps(this.workflow.id, this.workflowStep)
      .pipe(
        takeUntil(this._$destroy)
      )
      .subscribe(response => {
        this._message.success('Saved Changes');
        this.close('save', response);
      });
  }

  // TODO remove
  public setDefaultStep() {
    this._workflowData.save(Object.assign(this.workflow, { default_workflow_step_id: this.workflowStep.id }))
    .subscribe(response => {
      Object.assign(this.workflowStep, response);
    });
  }

  public remove() {
    this._workflowData.deleteSteps(this.workflow.id, this.workflowStep)
      .pipe(
        takeUntil(this._$destroy)
      )
      .subscribe((response) => {
        this.close( 'delete', response);
      });
  }

  public close(action = 'close', data = null ) {
    this._dialogRef.close({ action, data, removedPaths: this._removedPaths });
  }

  private saveOrder(data) {
    this._workflowData.orderPath(
      this.workflow.id,
      this.workflowStep.id,
      { workflow_path_ids: list(data, 'id')
      })
      .pipe(
        takeUntil(this._$destroy)
      )
      .subscribe((response) => {
        console.log(response);
      })
  }

}
