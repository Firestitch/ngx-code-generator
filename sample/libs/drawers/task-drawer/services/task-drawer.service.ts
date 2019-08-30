import { Injectable, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { MatDialog } from '@angular/material';

import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FsPrompt } from '@firestitch/prompt';

import {
  DrawerRef,
  FsDrawerAction,
  FsDrawerService,
  IDrawerConfig,
} from '@firestitch/drawer';


import { AuthService, TaskData } from '@app/core';
import { Task } from '@app/shared/interfaces';

import { TaskComponent, TaskManageSubscriptionsComponent } from '../components';



@Injectable({
  providedIn: 'root',
})
export class TaskDrawerService implements OnDestroy {

  public task: Task = null;

  public notificationsEnabled = false;

  private _drawerRef: DrawerRef<TaskComponent> = null;

  private readonly drawerClosed$ = new Subject<Task>();

  private readonly removeClicked$ = new Subject<Task>();

  private _destroy = new Subject();

  private _account: Account = null;

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _fsPrompt: FsPrompt,
    private _taskData: TaskData,
    private _drawer: FsDrawerService,
    private _dialog: MatDialog,
    private _authService: AuthService,
  ) {}

  get removeClicked(): Observable<Task> {
    return this.removeClicked$.asObservable();
  }

  get drawerClosed(): Observable<Task> {
    return this.drawerClosed$.asObservable();
  }

  public ngOnDestroy() {
    // if (this._drawerRef) {
    //   this._drawerRef.close();
    // }

    // this.drawerClosed$.complete();
    // this.removeClicked$.complete();

    // this._destroy.next();
    // this._destroy.complete();
  }

  public openDrawer(taskCode: string) {

    if (!this._drawerRef) {
      this.initAndOpenDrawer();
    }

    this.loadTask(taskCode);

    this._authService.loggedInAccount$
      .pipe( takeUntil(this._destroy))
      .subscribe(store => this._account = store.value);
  }

  public closeDrawer() {
    this._drawer.closeAll();
  }

  private loadTask(taskCode: string) {
    const query = {
      categories: true,
      projects: true,
      statuses: true,
      types: true,
      tags: true,
      assigned_accounts: true,
      current_status_due: true,
      workflow_step_id: true,
      identifier: taskCode,
      subscribed: true,
    };

    if (taskCode) {
      this._taskData.gets(query, { key: 'task' })
        .pipe(
          takeUntil(this._destroy),
        )
        .subscribe((task) => {
          this.task = this._taskData.create(task);
          this._drawerRef.dataChange({ task: this.task });
          this.toggleNotification();
        });
    } else {
      // TODO why???
      setTimeout(() => {
        this.task = this._taskData.create();
        this._drawerRef.dataChange({ task: this.task });
      }, 0);
    }
  }

  private initAndOpenDrawer() {

    const config: IDrawerConfig = {
      disableClose: false,
      position: 'right',
      activeAction: 'settings',
      resize: {
        min: 500,
        max: null
      },
      actions: [
        {
          icon: 'clear',
          type: FsDrawerAction.Button,
          close: true,
          click: () => {
            this._drawerRef.close();
            this.navigateToParent();
          }
        },
        {
          icon: 'share',
          name: 'related',
          type: FsDrawerAction.Button,
          tooltip: 'Related Objects',
          click: () => {
          }
        },
        {
          icon: this.notificationsIcon(),
          name: 'notifications',
          type: FsDrawerAction.Button,
          toggle: false,
          tooltip: 'Notifications',
          data: this.notificationsEnabled,
          click: (data) => {
            this.task.subscribed = !data.action.data;
            if (data.action.data) {
              this.unsubscribeUser();
            } else {
              this.subscribeUser();
            }
          }
        },
        {
          icon: 'restore',
          name: 'versions',
          type: FsDrawerAction.Button,
          tooltip: 'Versions',
          click: () => {}
        },
        {
          icon: 'more_vert',
          type: FsDrawerAction.Menu,
          actions: [
            {
              icon: null,
              label: 'Info',
              click: (event) => {
                this._drawerRef.setActiveAction('info');
              }
            },
            {
              icon: null,
              label: 'Manage Subscribers',
              click: (event, menuRef) => {
                // console.log('clicked sub menu action');
                this.openManageSubscribersDialog();
              }
            },
            {
              icon: null,
              label: 'Delete',
              click: (event) => {
                this.deleteActionClicked(this.task);
              }
            },
          ]
        },
      ]
    };

    this._drawerRef = this._drawer.open(TaskComponent, config) as DrawerRef<TaskComponent, any>;

    this._drawerRef.afterClosed()
    .pipe(
      takeUntil(this._destroy)
    )
    .subscribe(() => {
      this.drawerClosed$.next(this.task);
      this._drawerRef = null;
    });
  }


  private deleteActionClicked(task) {

    this._fsPrompt.confirm({
      title: 'Confirm',
      template: 'Are you sure you would like to delete this Task?'
    }).pipe(
      takeUntil(this._destroy),
    ).subscribe(() => {
      this._taskData.delete(this.task)
      .pipe(
        takeUntil(this._destroy),
      )
      .subscribe(() => {
        this.removeClicked$.next(this.task);
        this._drawerRef.close();
        this.navigateToParent();
      });
    });
  }

  private navigateToParent() {
    this._router.navigate(
      [],
      { relativeTo: this._route, queryParams: { object: null }, queryParamsHandling: 'merge' }
      );
  }

  private openManageSubscribersDialog() {
    const dialogRef = this._dialog.open(
      TaskManageSubscriptionsComponent,
      { data: this.task, width: '500px' }
      );

    dialogRef.afterClosed().subscribe((response) => {
      this.task.subscribers = response;
      const isSubscribed = this.task.subscribers.find((subscriber) => {
        return subscriber.id === Number(this._account.id)
      });

      this.task.subscribed = !!isSubscribed;
      this.toggleNotification();
    })
  }

  private toggleNotification() {
    const notifier = this._drawerRef.getAction('notifications');
    if (notifier) {
      notifier.data = this.task.subscribed;
      this.notificationsEnabled = this.task.subscribed;
      notifier.icon = this.notificationsIcon();
    }
  }

  private subscribeUser() {
    this._taskData.subscribeUser(this.task.id)
      .pipe(takeUntil(this._destroy))
      .subscribe(() => {
        this.toggleNotification();
      })
  }

  private unsubscribeUser() {
    this._taskData.unsubscribeUser(this.task.id)
      .pipe(takeUntil(this._destroy))
      .subscribe(() => {
        this.toggleNotification();
      })
  }

  private notificationsIcon() {
    return this.notificationsEnabled ? 'volume_up' : 'volume_off';
  }
}
