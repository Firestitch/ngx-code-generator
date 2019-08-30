import { Component, OnInit, Input, Output, OnDestroy, EventEmitter } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { WorkflowData, AclQueryService } from 'app/core';
import { Workflow, Task } from 'app/shared/interfaces';


@Component({
  selector: 'task-info',
  templateUrl: './task-info.component.html',
  styleUrls: ['./task-info.component.scss']
})
export class TaskInfoComponent implements OnInit, OnDestroy {

  @Input() public task: Task = null;
  @Output() public workflowChanged = new EventEmitter<number>();

  public isAdmin = false;

  public workflows: Workflow[] = [];

  private _destroy$ = new Subject();

  constructor(private _workflowData: WorkflowData,
              private _aclQueryService: AclQueryService) {}

  public ngOnInit() {
    this._workflowData.gets()
      .pipe(
        takeUntil(this._destroy$)
      )
      .subscribe((response) => this.workflows = response);

    this.isAdmin = this._aclQueryService.hasPermissionApp();
  }

  public ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public changeWorkflow(workflow_id: number) {

    if (workflow_id !== this.task.workflow_id) {
      this.workflowChanged.emit(workflow_id);
    }
    this.task.workflow_id = workflow_id;
  }
}
