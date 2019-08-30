import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { MatDialog } from '@angular/material';

import { FsListConfig, FsListAbstractRow } from '@firestitch/list';
import { nameValue, list as fsList } from '@firestitch/common';
import { FsPrompt } from '@firestitch/prompt';
import { SelectionActionType } from '@firestitch/selection';

import { of, Subject, Observable } from 'rxjs';
import { map, takeUntil, tap, flatMap } from 'rxjs/operators';

import {
  StatusData,
  TypeData,
  AccountData,
  TaskData,
  WorkflowData,
  ObjectService,
  ObjectFilterService
} from '@app/core';

import { Project, Task, Object } from '@app/shared';
import { TaskCreateComponent } from '@libs/related-objects/components';
import { State } from '@app/shared';
import { ObjectDrawerService } from 'libs/drawers/drawer';

@Component({
  selector: 'projects-tasks-list',
  templateUrl: './tasks-list.component.html',
  styleUrls: ['./tasks-list.component.scss']
})
export class ProjectsTasksListComponent implements OnInit, OnDestroy {
  private _project: Project = null;

  public get project(): Project {
    return this._project;
  }

  @Input() public set project(value: Project) {
    this._project = value;

    if (this.listRef) {
      this.listRef.reload();
    }
  }

  @ViewChild('TasksList') public listRef = null;

  public config: FsListConfig = null;
  public states = {
    active: State.Active,
    deleted: State.Deleted
  };

  private _destroy$ = new Subject();

  private _dueDateFilterData = [
    { name: 'Any', value: '__all' },
    { name: 'Upcoming', value: 'upcoming' },
    { name: 'Overdue', value: 'overdue' },
    { name: 'Not Defined', value: 'not_defined' }
  ];

  constructor(
    private _taskData: TaskData,
    private _statusData: StatusData,
    private _router: Router,
    private _objectDrawerService: ObjectDrawerService,
    private _objectFilterService: ObjectFilterService,
    private _fsPrompt: FsPrompt,
    private _dialog: MatDialog,
  ) {}

  public registerDrawerService() {
    this._objectDrawerService.removeClicked
    .pipe(
      takeUntil(this._destroy$)
    ).subscribe((task: Task) => {
      this.listRef.removeData((row) => {
        return row.id === task.id
      });
    });

    this._objectDrawerService.drawerClosed
    .pipe(
      takeUntil(this._destroy$)
    ).subscribe((task: Task) => {

      this.listRef.updateData(
        task,
        (row: FsListAbstractRow) => {

          // Do recursive actions manually. List doesn't support deep merge
          if (row.id === task.id) {
            row.tags = task.tags;
          }

          return row.id === task.id;
        }
      );
    });
  }

  public ngOnInit() {
    this.loadStatuses();

    this.registerDrawerService();
  }

  public ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public openTaskDrawer(row: Object) {
    this._objectDrawerService.openObjectDrawer(row.project, row);
  }

  private loadStatuses() {
    this.initConfig();
  }

  private initConfig() {
    this.config = {
      sort: 'name,asc',
      status: true,
      filters: this._objectFilterService.getTaskFilters(),
      selection: {
        actions: [
          {
            type: SelectionActionType.Action,
            label: 'Delete',
            value: 'delete'
          },
          {
            type: SelectionActionType.Select,
            label: 'Update Status',
            options: this._statusData.gets({ class: 'task' })
            .pipe(
              map(response => nameValue(response, 'name', 'id'))
            )
          }
        ],
        onAction: (action) => {
         let subscription$: Observable<any>;

          if (action.value === 'delete') {
              subscription$ = this.deleteTasks(action.selectedRows)
          } else {
            // set status
            subscription$ = this.setStatusForTasks(action.selectedRows, action.value);
          }

          subscription$
            .subscribe({
              next: () => {
                this.listRef.reload();
              }
            });

          return subscription$;
        },
        onSelectAll: () => { },
        onCancel: () => { }
      },
      actions: [
        {
          label: 'Create Task',
          click: () => {
            this.openCreateTaskDialog();
          }
        }
      ],
      rowActions: [
        {
          click: data => {
            return this._taskData.delete(data);
          },
          remove: {
            title: 'Confirm',
            template: 'Are you sure you would like to delete this task?',
          },
          menu: true,
          label: 'Delete'
        },
        {
          click: (data) => {
            this._router.navigate(['/projects', data.project_id, 'tasks', data.id, 'audits']);
          },
          menu: true,
          label: 'Audits'
        }
      ],
      fetch: (query) => {

        // for current project
        if (this.project) {
          query.project_id = this.project.id;
        }

        query.types = true;
        query.tags = true;
        query.statuses = true;
        query.projects = true;
        query.modifier_accounts = true;
        query.assigned_accounts = true;
        query.current_status_due = query.current_status_due ? query.current_status_due : true;

        return this._taskData.gets(query, { key: null })
          .pipe(
            takeUntil(this._destroy$),
            map(response => ({ data: response.tasks, paging: response.paging }))
          )
      },
      restore: {
        query: { state: State.Deleted },
        filterLabel: 'Show Deleted',
        menuLabel: 'Restore',
        filter: true,
        click: (row) => {
          return this._taskData.put({id: row.id, state: 'active'})
            .pipe(
              takeUntil(this._destroy$)
            )
        }
      }

    };
  }

  private deleteTasks(selectedRows: Task[] = []) {
    const task_ids = fsList(selectedRows, 'id');

    return this._fsPrompt.confirm({
      title: 'Confirm',
      template: 'Are you sure you would like to delete selected tasks?'
    })
    .pipe(
      takeUntil(this._destroy$),
      flatMap((response) => this._taskData.bulkDelete(task_ids)),
      map(() => true)
    )
  }

  private setStatusForTasks(selectedRows: Task[] = [], status_id: number) {
    const task_ids = fsList(selectedRows, 'id');

    return this._taskData.bulk(task_ids, status_id )
      .pipe(
        takeUntil(this._destroy$),
        map(() => true)
      )
  }

  private openCreateTaskDialog() {
    const project_id = this.project ? this.project.id : null;

    const dialogRef = this._dialog.open(TaskCreateComponent, {
      data: { project_id },
      width: '30%',
      minWidth: '400px',
    });

    dialogRef.afterClosed().subscribe((response) => {
      if (response) {
        this.listRef.reload();
        this._objectDrawerService.openObjectDrawer(response.project, response);
      }
    })
  }
}
