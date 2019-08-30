import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FsMessage } from '@firestitch/message';

import { Task, Type, Project, Workflow } from '@app/shared/interfaces';

import {
  TypeData,
  TaskData,
  WorkflowData,
  ProjectData,
  SessionService
} from '@app/core';


@Component({
  selector: 'app-task-create',
  templateUrl: './task-create.component.html',
})
export class TaskCreateComponent implements OnInit, OnDestroy {

  public task: Task = { id: null };

  public types: Type[] = [];
  public workflows: Workflow[] = [];
  public projects: Project[] = [];

  private _$destroy = new Subject();

  constructor(
    private _dialogRef: MatDialogRef<TaskCreateComponent>,
    private _fsMessage: FsMessage,
    private _taskData: TaskData,
    private _typeData: TypeData,
    private _workflowData: WorkflowData,
    private _ProjectData: ProjectData,
    private _sessionService: SessionService,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
  }

  public ngOnInit() {
    this.task = this._taskData.create({ id: null, project_id: this.data.project_id });
    this.loadTypes();
    this.loadWorkflows();
    this.loadProjects();
  }

  public ngOnDestroy() {
    this._$destroy.next();
    this._$destroy.complete();
  }

  public save() {
    this._taskData.save(this.task)
      .pipe(
        takeUntil(this._$destroy)
      )
      .subscribe(response => {
        this._fsMessage.success('Task created');
        this.close(response);
      });
  }

  public close(data = null) {
    this._dialogRef.close(data);
  }

  private loadTypes() {
    this._typeData.gets({ class: 'task' })
      .pipe(
        takeUntil(this._$destroy)
      )
      .subscribe((types: Type[]) => {
        this.types = types;
      })
  }

  private loadProjects() {
    let workspace_id;
    if (this._sessionService.environment()) {
      workspace_id = this._sessionService.environment().id;
    }

    this._ProjectData.gets({ workspace_id }, { key: null })
      .pipe(
        takeUntil(this._$destroy)
      )
      .subscribe((response) => {
        this.projects = response.projects;
      })
  }

  private loadWorkflows() {
    this._workflowData.gets()
      .pipe(
        takeUntil(this._$destroy)
      )
      .subscribe((workflows: Workflow[]) => {
        this.workflows = workflows;
        const defaultWorkflow = this.workflows.find((workflow) => workflow.default === 1);
        if (defaultWorkflow) {
          this.task.workflow_id = defaultWorkflow.id;
        }
      })
  }

}
