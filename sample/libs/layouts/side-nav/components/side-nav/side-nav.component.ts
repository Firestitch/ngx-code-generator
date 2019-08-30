import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, ActivationEnd, NavigationEnd, NavigationStart, ActivatedRoute } from '@angular/router';
import { MatDialog, MatSidenav } from '@angular/material';

import { filter, takeUntil } from 'rxjs/operators';

import { FsStore } from '@firestitch/store';
import { BodyClassRenderer } from '@firestitch/body';
import { ItemActionType, SidenavConfig } from '@firestitch/sidenav';

import { AclQueryService } from '@app/core';
import { AuthService } from '@app/core/services';
import { SearchDialogComponent } from '@app/search';
import { Account } from '@app/shared/interfaces';
import { TimerComponent } from '@libs/timer';

import { SidenavService } from '../../services/sidenav.service';
import { EnvironmentMenuComponent } from '../environment-menu/environment-menu.component';
import { SearchProjectComponent } from '../search-project/search-project.component';
import { Subject } from 'rxjs';
import { TimerService } from '@app/time-entry';


@Component({
  selector: 'app-page-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent implements OnInit, OnDestroy {

  @ViewChild('sidenav') sidenav: MatSidenav;

  public searchName: string;
  public account: Account = null;
  public disableClose: boolean;
  public sideNavMain: SidenavConfig = { items: [] };
  public sideNavBottom: SidenavConfig = { items: [] };
  public workspaceSidenavItems = [];
  public systemSidenavItems = [];
  public adminSidenavItems = [];

  private projectRouteObserver = null;
  private timerSidenavItem = null;
  private _projectSidenavItem: any = { hide: true };
  private _destroy$ = new Subject();

  constructor(public sidenavService: SidenavService,
              private _store: FsStore,
              private _dialog: MatDialog,
              private _router: Router,
              private _aclQueryService: AclQueryService,
              private _timerService: TimerService,
              private _bodyClassRenderer: BodyClassRenderer,
              private _authService: AuthService) {

    this._bodyClassRenderer.addBodyClass('body-side-nav');

    this.disableClose = this.sidenavService.mode !== 'over';

    this.sidenavService.resize$
    .pipe(
      takeUntil(this._destroy$)
    )
    .subscribe(() => {
      this.disableClose = this.sidenavService.mode !== 'over';

      if (this.sidenavService.opened) {
        this.sidenav.open();
      }
    })

    this._router.events.pipe
    (
      filter((event) => event instanceof NavigationStart)
    )
    .subscribe((event: NavigationStart) => {
      this.projectRouteObserver = false;
    });

    this._router.events.pipe
      (
        filter((event) => event instanceof ActivationEnd)
      )
      .subscribe((event: ActivationEnd) => {
        if (event.snapshot.data && event.snapshot.data.projectSideNav) {
          this.projectRouteObserver = event.snapshot.data.project;
        }
      });

    this._router.events.pipe
    (
      filter((event) => event instanceof NavigationEnd)
    )
    .subscribe((event: NavigationEnd) => {
      if (this.projectRouteObserver) {
        this.projectRouteObserver
          .subscribe(project => {
            if (project) {
              Object.assign(this._projectSidenavItem, {
                superlabel: 'Project',
                label: project.name,
                path: '/projects/' + project.id,
                class: ['project'],
                exact: true,
                hide: false,
                items: [
                  { label: 'Settings', path: `/projects/${project.id}/overview`, paths: [/\/projects\/\d+\/overview/] },
                  { label: 'Tasks', path: `/projects/${project.id}/tasks` },
                  { label: 'Docs', path: `/projects/${project.id}/docs`, paths: [/\/projects\/\d+\/doc/] },
                  { label: 'Images', path: `/projects/${project.id}/images` },
                  // { label: 'Workflows', path: `/projects/${project.id}/workflows`}
                ]
              });
            }
          });
      } else {
        this._projectSidenavItem.hide = true;
      }
    });

    this.timerSidenavItem = {
      label: 'Timer',
      icon: 'timer',
      menu: {
        component: TimerComponent,
        offsetX: 10
      }
    };
  }

  public ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public ngOnInit() {

    this.sideNavMain.items = [
      this.timerSidenavItem,
      {
        label: 'Search',
        icon: 'search',
        click: () => {
          this._dialog.open(SearchDialogComponent, {
            width: '600px'
          });
        }
      },
      {
        label: 'Projects',
        path: '/projects',
        icon: 'folder',
        actions: [
          {
            type: ItemActionType.Menu,
            icon: 'more_vert',
            menu: {
              component: SearchProjectComponent
            }
          }
        ]
      },
      this._projectSidenavItem,
      {
        label: 'Tasks',
        path: '/projects/tasks',
        icon: 'assignment'
      },
      {
        label: 'Reports',
        path: '/reports',
        icon: 'assessment',
        items: [
          {
            label: 'Time Entries',
            path: '/reports/timeentries',
            exact: false
          }
        ]
      }
    ];

    this._timerService.timer$
      .subscribe(response => {
        this.timerSidenavItem.label = response ? response.formatted_time : 'Timer';
      });

    this._store.observe('permissions')
    .subscribe(store => {

      this.adminSidenavItems = [];
      if (!this._aclQueryService.hasPermissionApp()) {
        return;
      }

      this.adminSidenavItems = [
          {
            label: 'Admin',
            path: '/admin',
            icon: 'settings',
            class: 'admin',
            items: [
              {
                label: 'Accounts',
                path: '/admin/accounts',
                exact: false
              },
              {
                label: 'Projects',
                path: '/admin/projects/statuses',
                exact: false
              },
              {
                label: 'Tasks',
                path: '/admin/tasks',
                exact: false
              },
              {
                label: 'Docs',
                path: '/admin/docs',
                exact: false
              },
              {
                label: 'Workspaces',
                path: '/admin/workspaces',
                exact: false
              },
              {
                label: 'Content',
                path: '/admin/content',
                exact: false
              },
              {
                label: 'Messages',
                path: '/admin/messages',
                exact: false
              }
            ]
          }
        ];

        if (!this._aclQueryService.hasPermissionSystem()) {
          return;
        }

        this.systemSidenavItems = [
          {
            label: 'System',
            path: '/system',
            icon: 'personal_video',
            items: [
              {
                label: 'Settings',
                path: '/system/settings'
              },
              {
                label: 'Crons',
                path: '/system/crons'
              },
              {
                label: 'File Manager',
                path: '/system/files'
              },
              {
                label: 'Processes',
                path: '/system/processes'
              },
              {
                label: 'Logs',
                path: '/system/logs'
              }
            ]
          }
        ];

        this._buildSidenavBottom();
    });

    this._store.observe('environment')
      .subscribe(store => {

        const environment = store.value;

        const item: any = {
          superlabel: 'Workspace',
          label: 'Not Selected',
          actions: [
            {
              type: ItemActionType.Menu,
              icon: 'more_vert',
              menu: {
                component: EnvironmentMenuComponent,
                data: { workspace: environment }
              }
            }
          ]
        };

        if (environment) {
          item.label = environment.name;
          item.image = environment.image.small;
          item.path = `/workspace/${environment.id}`;
          item.paths = [/\/workspace\/\d+/];
        }

        this.workspaceSidenavItems = [item];

        this._buildSidenavBottom();
    });


    this._store.observe('account').subscribe((store) => {
      this.account = store.value;
    });
  }

  public clickNav($event) {
    this.sidenavService.hide();
  }

  public proceedHome() {
    if (window.location.pathname !== '/projects') {
      this._router.navigateByUrl(`/`);
    }
  }

  private _buildSidenavBottom() {

    const signout = {
      label: 'Sign Out',
      icon: 'exit_to_app',
      click: () => {
        this._authService.signout();
      }
    }

    this.sideNavBottom = { items: [].concat(this.workspaceSidenavItems, this.adminSidenavItems, this.systemSidenavItems, [signout]) };
  }
}
