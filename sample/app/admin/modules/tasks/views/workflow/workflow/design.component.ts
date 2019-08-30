import { Component, OnInit, OnDestroy, ViewChild, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';

import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { RouteObserver } from '@firestitch/core';
import { FsZoomPanComponent } from '@firestitch/zoom-pan';
import { ConnectionOverlayType, FsModelDirective } from '@firestitch/model';

import { WorkflowData, StatusData } from '@app/core';
import { Workflow, WorkflowStep, WorkflowPath, WorkflowTask, Status } from '@app/shared';
import {
  WorkflowStepComponent,
  WorkflowPathComponent,
  WorkflowEditTaskComponent
} from '../../../../shared/components';
import { WorkflowActionType } from '@app/shared';
import { WorkflowAction } from '@app/shared';


@Component({
  templateUrl: './design.component.html',
  styleUrls: ['./design.component.scss']
})
export class DesignComponent implements OnInit, OnDestroy {

  @ViewChild(FsZoomPanComponent)
  public zoomPan: FsZoomPanComponent;

  @ViewChild(FsModelDirective)
  public model: FsModelDirective;

  public workflowStepStatuses = {};
  public statuses = [];
  public workflow: Workflow = null;
  public workflowSteps: WorkflowStep[] = [];
  public workflowTasks: WorkflowTask[] = [];

  private _routeObserver = new RouteObserver(this._route.parent, 'workflow');
  private _destroy$ = new Subject();

  constructor(
    private _route: ActivatedRoute,
    private _dialog: MatDialog,
    private _workflowData: WorkflowData,
    private _statusData: StatusData
  ) { }

  public ngOnInit() {
    this._routeObserver
      .subscribe(workflow => {
        this.workflow = workflow;
        this.loadData();
      });

    this._statusData.gets({ class: 'task' })
      .pipe(
        takeUntil(this._destroy$)
      )
      .subscribe((response) => this.statuses = response);
  }

  public ngOnDestroy() {
    this._routeObserver.destroy();
    this._destroy$.complete();
  }

  public zoomIn() {
    this.zoomPan.zoomIn();
  }

  public zoomOut() {
    this.zoomPan.zoomOut();
  }

  public reset() {
    this.zoomPan.reset();
  }

  private loadData() {
    this.loadTasks();
    this.loadSteps();
  }

  private loadTasks() {
    this.workflowTasks.length = 0;

    const queryTasks = {
      subscribers: true,
      assign_accounts: true,
      types: true
    };

    this._workflowData.getsTasks(this.workflow.id, queryTasks)
      .pipe(
        takeUntil(this._destroy$)
      )
      .subscribe(response => {
        this.workflowTasks = response;
      });
  }

  private loadSteps() {
    this.workflowSteps.length = 0;

    const querySteps = {
      statuses: true,
      workflow_paths: true,
      workflow_tasks: true,
      workflow_actions: true,
      target_workflow_tasks: true,
      workflow_action_related_accounts: true
    };

    this._workflowData.getsSteps(this.workflow.id, querySteps)
      .pipe(
        takeUntil(this._destroy$)
      )
      .subscribe((response) => {
        this.workflowSteps.push(...response);

        setTimeout(() => {
          //Hack to wait for initing of directives. Must rewrite fsModel handling of this.
          this.initPaths();
        });

        response.forEach((workflowStep) => {
          if (workflowStep.workflow_task) {
            this.workflowStepStatuses[workflowStep.workflow_task.id + '-' + workflowStep.status_id] = true;
          }
        });
      });
  }

  private initPaths() {

    this.workflowSteps.forEach((sourceWorkflowStep) => {

      sourceWorkflowStep.workflow_paths.forEach((workflowPath) => {

        const targetWorkflowStep = this.workflowSteps.find((step: WorkflowStep) => {
          return step.id === workflowPath.target_workflow_step_id
        });

        if (sourceWorkflowStep) {
          const config = this.getConnectionConfig(workflowPath);
          this.model.connect(sourceWorkflowStep, targetWorkflowStep, config);
        }
      });
    });
  }

  public workflowTaskStatusClick(workflowTask: WorkflowTask, status: Status) {
    const stepStatus = this.workflowStepStatuses[workflowTask.id + '-' + status.id];

    if (stepStatus) {
      this.addWorkflowStepStatus(workflowTask, status);
    } else {
      this.removeWorkflowStepStatus(workflowTask, status);
    }
  }

  private removeWorkflowStepStatus(workflowTask: WorkflowTask, status: Status) {
    const deletedSteps = this.workflowSteps.find((step) => {
      return step.status_id === status.id && step.workflow_task_id === workflowTask.id
    });

    this._workflowData.deleteSteps(this.workflow.id, deletedSteps)
      .pipe(
        takeUntil(this._destroy$)
      )
      .subscribe(response => {
        const index = this.workflowSteps.findIndex((step: WorkflowStep) => {
          return step.status_id === status.id && step.workflow_task_id === workflowTask.id
        });

        if (index !== -1) {
          const step = this.workflowSteps[index];
          this.workflowSteps.splice(index, 1);

          this.workflowSteps.forEach((workflow_step: WorkflowStep) => {
            const dependsIndex = workflow_step.workflow_paths.findIndex((path: WorkflowPath) => {
                return path.target_workflow_step_id === step.id
              });

            if (dependsIndex !== -1) {
              workflow_step.workflow_paths.splice(dependsIndex, 1);
            }
          })
        }

      });
  }

  private addWorkflowStepStatus(workflowTask: WorkflowTask, status: Status) {
    this.workflowStepStatuses[workflowTask.id + '-' + status.id] = true;
    const workflowStep = {
      x1: 100,
      y1: 100,
      workflow_task_id: workflowTask.id,
      status_id: status.id
    };

    this._workflowData.postSteps(this.workflow.id, workflowStep)
      .pipe(
        takeUntil(this._destroy$)
      )
      .subscribe(response => {
        response.status = status;
        response.workflow_task = workflowTask;
        response.workflow_paths = [];
        this.workflowSteps.push(response);
      });
  }

  public connectionCreated(e) {
    if(!e.event) {
      return;
    }

    const workflowPath: WorkflowPath = {
      id: null,
      target_workflow_step_id: e.targetModelObject.data.id,
      source_workflow_step_id: e.sourceModelObject.data.id,
      workflow_id: this.workflow.id,
    };

    // path can't end on the start step.
    if (e.targetModelObject.data.type === 'start') {
      this.processWorkflowPathByAction('cancel', workflowPath, e.connection.id);
      return;
    }

    // if connection between these two objects already exists
    const isExistingConnection = e.sourceModelObject.data.workflow_paths.find((path) => {
      return path.target_workflow_step_id === e.targetModelObject.data.id
    });

    if (isExistingConnection) {
      this.processWorkflowPathByAction('cancel', workflowPath, e.connection.id);
      return;
    }

    this.openWorkflowPathDialog(workflowPath);
  }

  public openWorkflowPathDialog(workflowPath: WorkflowPath) {
    const workflowStep = this.workflowSteps.find((step: WorkflowStep) => {
      return step.id === workflowPath.source_workflow_step_id
    });

    this._dialog.open(WorkflowPathComponent, {
      width: '50%',
      minWidth: '400px',
      disableClose: true,
      data: {
        workflowPath: workflowPath,
        workflow: this.workflow,
        taskId: workflowStep.workflow_task_id,
        sourceWorkflowStep: workflowStep
      }
    })
    .afterClosed()
    .pipe(
      takeUntil(this._destroy$)
    )
    .subscribe((response: any) => {

      if (!response) {
        return
      }

      this.processWorkflowPathByAction(response.action, response.workflowPath);
    });
  }

  public workflowStepClick(event: Event, workflowStep: WorkflowStep) {
    if (!event.defaultPrevented) {
        this.openWorkflowStepDialog(workflowStep);
    }
  }

  public workflowStepDragStop(event: any) {

    const workflowStep = event.data;
    workflowStep.x1 = event.x1;
    workflowStep.y1 = event.y1;

    this._workflowData.saveSteps(this.workflow.id, workflowStep)
    .pipe(
      takeUntil(this._destroy$)
    )
    .subscribe((response) => {
      Object.assign(workflowStep,response);
    });
  }

  public openWorkflowStepDialog(workflowStep: WorkflowStep = { id: null }) {

    const dialogRef = this._dialog.open(WorkflowStepComponent, {
      width: '50%',
      minWidth: '400px',
      disableClose: true,
      data: {
        workflowStep: workflowStep,
        workflow: this.workflow
      }
    });

    dialogRef.afterClosed()
    .pipe(
      takeUntil(this._destroy$)
    )
    .subscribe((response) => {
      if (!response) {
        return;
      }

      this.processStepDialogResponse(response.action, response.data, response.removedPaths);
    });
  }

  private processStepDialogResponse(
    action: 'close' | 'save' | 'delete' | 'path',
    workflowStep: WorkflowStep,
    deletedPaths: WorkflowPath[]) {

    switch (action) {
      case 'path': {
        this.openWorkflowPathDialog(workflowStep);
      } break;
      case 'save': {
        const step = this.workflowSteps.find((step: WorkflowStep) => {
          return step.id === workflowStep.id
        });

        if (step) {
          Object.assign(step, workflowStep);
        }
      } break;
      case 'delete': {
        const index = this.workflowSteps.findIndex((step: WorkflowStep) => step.id === workflowStep.id);

        if (index !== -1) {
          const step = this.workflowSteps[index];
          this.workflowSteps.splice(index, 1);
          this.workflowStepStatuses[step.workflow_task.id + '-' + step.status.id] = false;

          this.workflowSteps.forEach((workflow_step: WorkflowStep) => {
            const dependsIndex = workflow_step.workflow_paths.findIndex((path: WorkflowPath) => {
              return path.target_workflow_step_id === step.id
            });

            if (dependsIndex !== -1) {
              workflow_step.workflow_paths.splice(dependsIndex, 1);
            }
          })
        }
      }
    }

    if (deletedPaths.length) {
      deletedPaths.forEach((path: WorkflowPath) => {
        this.processWorkflowPathByAction('delete', path);
      })
    }
  }

  public openEditTaskDialog(workflowTask: WorkflowTask) {
    const dialogRef = this._dialog.open(
      WorkflowEditTaskComponent,
      {
        width: '50%',
        minWidth: '400px',
        data: { workflowTask },
      }
    );

    dialogRef
      .afterClosed()
      .pipe(
        takeUntil(this._destroy$)
      )
      .subscribe((response: { action: string, taskWorflow: WorkflowTask }) => {
        if(response) {
          const steps = this.workflowSteps.filter((step) => step.workflow_task_id === response.taskWorflow.id);
          steps.forEach((step: WorkflowStep) => {
            step.workflow_task = response.taskWorflow
          });
        }
      })
  }

  private getConnectionConfig(workflowPath: WorkflowPath) {
    const actionsCount = workflowPath.workflow_actions.length;

    const actionsLabel = actionsCount
      ? `${actionsCount} ${actionsCount === 1 ? 'Action' : 'Actions'}`
      : '';

    const name = workflowPath.name ? workflowPath.name  + '\n' : '';
    const tooltip = this.formTooltip(workflowPath);

    const config =  {
      overlays: [
        {
          type: ConnectionOverlayType.Label,
          label: `${name} ${actionsLabel}`,
          click: () => {
            this.openWorkflowPathDialog(workflowPath);
          }
        },
      ],
      click: () => {
        this.openWorkflowPathDialog(workflowPath);
      },
      data: { object: workflowPath }
    };

    if(tooltip) {
      config.overlays.push(
        {
          type: ConnectionOverlayType.Tooltip,
          label: tooltip,
          click: () => { },
        }
      )
    }

    return config;
  }

  private processWorkflowPathByAction(
    action: 'close' | 'save' | 'delete' | 'cancel',
    workflowPath: WorkflowPath,
    uniqConnectionId: string = null) {
    const targetWorkflowStep = this.workflowSteps.find((step: WorkflowStep) => {
      return step.id === workflowPath.target_workflow_step_id
    });

    const sourceWorkflowStep = this.workflowSteps.find((step: WorkflowStep) => {
      return step.id === workflowPath.source_workflow_step_id
    });

    if(sourceWorkflowStep && targetWorkflowStep) {
      const connection = this.getConnectionBySteps(targetWorkflowStep, sourceWorkflowStep, uniqConnectionId);

      const index = sourceWorkflowStep.workflow_paths.findIndex((path: WorkflowPath) => {
        return path.id === workflowPath.id;
      });

      if (connection) {
        switch (action) {
          case 'close':
          case 'cancel': {
            if (!workflowPath.id && index === -1 ) {
              this.model.disconnect(connection);
            } else if (workflowPath.id) {
              this.model.disconnect(connection);
              this.model.connect(sourceWorkflowStep, targetWorkflowStep, this.getConnectionConfig(workflowPath));
            }
          } break;
          case 'delete': {
            this.model.disconnect(connection);
            sourceWorkflowStep.workflow_paths.splice(index, 1);
          } break;
          case 'save': {
            this.model.disconnect(connection);
            this.model.connect(sourceWorkflowStep, targetWorkflowStep, this.getConnectionConfig(workflowPath));

            if (index !== -1) {
              sourceWorkflowStep.workflow_paths[index] = workflowPath;
            } else {
              sourceWorkflowStep.workflow_paths.push(workflowPath);
            }
          } break;
        }
      }
    }
  }

  private getConnectionBySteps(target: WorkflowStep, source: WorkflowStep, uniqConnectionId: string = null) {
    const connectionArray = this.model.getConnections({ target, source });
    if (uniqConnectionId) {
      return connectionArray.find((connection) => connection.id === uniqConnectionId)
    } else {
      return connectionArray[0]
    }
  }

  private formTooltip(path: WorkflowPath) {
    let tooltip = '';

    path.workflow_actions.forEach((action: WorkflowAction) => {
      switch (action.type) {
        case WorkflowActionType.Comment: {
          if (action.configs.comment_required) {
            tooltip += 'Required Comment\n';
          } else {
            tooltip += 'Add Comment\n';
          }
        } break;
        case WorkflowActionType.AccountAssignment: {
          if (action.assign_account) {
            tooltip += `Assign to ${action.assign_account.name}\n`;
          }
        } break;
        case WorkflowActionType.AddSubscriber: {
          tooltip += `Set Subscribers: `;
          if (action.subscriber_accounts) {
            action.subscriber_accounts.forEach((subscriber: Account, idx: number) => {
              tooltip += subscriber.name;
              tooltip += idx === action.subscriber_accounts.length - 1 ? '\n' : ',\n';
            })
          }
        } break;
      }
    });

    return tooltip;
  }

}
