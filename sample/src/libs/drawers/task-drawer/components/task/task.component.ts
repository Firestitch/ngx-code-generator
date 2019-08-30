import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { FsMessage } from '@firestitch/message';
import { DRAWER_DATA, DrawerRef } from '@firestitch/drawer';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import {
  TypeData,
  TaskData,
  ObjectService,
  WorkflowData,
  ObjectData,
} from '@app/core';

import { Status, Type, Account, Task, Project, Priority, WorkflowPath } from '@app/shared/interfaces';
import { AuditsLogsComponent } from './audits-logs/audits-logs.component';


@Component({
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit, OnDestroy {

  @ViewChild(AuditsLogsComponent) public logs: AuditsLogsComponent = null;

  public task: Task = null;
  public accounts: Account[] = [];
  public types: Type[] = [];
  public project: Project;

  public relatedObjects: Object[] = [];
  public workflowPaths: WorkflowPath[] = [];

  private _destroy = new Subject();

  constructor(
    private _taskData: TaskData,
    private _fsMessage: FsMessage,
    private _typeData: TypeData,
    private _workflowData: WorkflowData,
    private _objectService: ObjectService,
    private _objectData: ObjectData,
    public drawer: DrawerRef<TaskComponent>,
    @Inject(DRAWER_DATA) public data
  ) { }

  public ngOnInit() {
    this.drawer.dataChanged$.pipe(
      takeUntil(this._destroy)
    ).subscribe(() => {
      this.task = this.data.task;
      this.getRelatedObjects();
      this.getWorkflowSettings();
    });

    this._typeData.gets({ class: 'task' })
      .pipe(
        takeUntil(this._destroy)
      ).subscribe((types) => {
        this.types = types;
      });
  }

  public ngOnDestroy() {
    this._destroy.next();
    this._destroy.complete();
  }

  public changeStatus(status: Status) {
    this.task.status = status;
    this.task.status_id = status.id;
    this.save({ status_id: status.id });
  }

  public changeWorkflow(workflow_id: number) {
    this.save({ workflow_id: workflow_id });
  }

  public changeAccount(account: Account) {
    this.task.assigned_account = account;
    this.task.assigned_account_id = account.id;
    this.save({ assigned_account_id: account.id });
  }

  public changePriority(priority: Priority) {
    this.task.priority = priority.value;
    this.save({ priority: priority.value });
  }

  public tagsChanged(tags) {
    this.task.tags = tags;
  }

  public descriptionChanged(content) {
    this.task.content = content;
  }

  public changeName() {
    if (this.task.name) {
      this.save({ name: this.task.name });
    }
  }

  public changeType(type: Type) {
    this.task.type = type;
    this.task.type_id = type.id;
    this.save({ type_id: type.id });
  }

  public changeDueDate(e) {
    this.save({ due_date: this.task.due_date });
  }


  public save(changedParams) {

    // if it's task for creating
    if (!changedParams.id) {
      changedParams.project_id = this.task.project_id;
    }

    changedParams.id = this.task.id;

    this._taskData.save(changedParams)
      .pipe(
        takeUntil(this._destroy)
      )
      .subscribe((task: Task) => {
      this.task = Object.assign(this.task, task);
      this.getWorkflowSettings();
      this.logs.refresh();
      this._fsMessage.success('Saved Changes');
    })
  }

  public savedComment(newTask: Task) {
    this.task = Object.assign(this.task, newTask);
    this.getWorkflowSettings();
    this.logs.refresh();
  }

  public getRelatedObjects() {
    this._objectData.gets({ related_object_id: this.task.id, objects: true, projects: true })
      .pipe(
        takeUntil(this._destroy)
      )
      .subscribe(response => this.relatedObjects = response);
  }

  public getWorkflowSettings() {
    if(!this.task.workflow_step_id) {
      return;
    }

    const query = {
      workflow_paths: true,
      workflow_actions: true,
      target_workflow_steps: true,
      target_workflow_step_statuses: true,
      workflow_action_related_accounts: true,
    };

    this._workflowData.getStepPaths(
      this.task.workflow_id,
      this.task.workflow_step_id,
      query)
      .pipe(
        takeUntil(this._destroy)
      )
      .subscribe((paths) => {
        this.workflowPaths = paths;
      })
  }

  public updateTask(version: any) {

    this.task.content = version.content;
    this.task.object_version = version;
    this.task.object_version_id = version.id;

    this._fsMessage.success('Version Switched');
  }
}
