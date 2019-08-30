import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material';

import { Observable } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { FsListComponent, FsListConfig } from '@firestitch/list';
import { FsPrompt } from '@firestitch/prompt';
import { RouteObserver } from '@firestitch/core';
import { nameValue } from '@firestitch/common';
import { ItemType } from '@firestitch/filter';
import { FsMessage } from '@firestitch/message';

import { AccountData, NavService, AclRoleData, EnvironmentData } from '@app/core';
import { AccountRequest } from '@app/shared';

import { State, AclRoleLevel } from '@app/shared';
import { AccountStates } from '@app/shared';
import { InvitesListDialogComponent, AccountRequestComponent } from '@libs/dialogs/invites-list';
import { AuthService } from 'app/core';


@Component({
  templateUrl: './accounts.component.html'
})
export class AccountsComponent implements OnInit, OnDestroy {

  @ViewChild('table') public table: FsListComponent = null;
  public config: FsListConfig = null;
  public routeObserver = new RouteObserver(this._route, 'project');

  private _destroy$ = new Subject();

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _accountData: AccountData,
    private _environmentData: EnvironmentData,
    private _prompt: FsPrompt,
    private _dialog: MatDialog,
    private _navService: NavService,
    private _aclRoleData: AclRoleData,
    private _authService: AuthService,
    private _message: FsMessage
  ) { }

  public ngOnInit() {

    this.setTitle();

    this._navService.routeChange
      .pipe(takeUntil(this._destroy$))
      .subscribe(() => this.setTitle());

    this.config = {
      filters: [
        {
          name: 'keyword',
          type: ItemType.Keyword,
          label: 'Search'
        },
        {
          name: 'acl_role_id',
          type: ItemType.Select,
          label: 'Role',
          values: () => {
            return this._aclRoleData.gets({ level: [AclRoleLevel.System, AclRoleLevel.App].join(',') })
            .pipe(
              map(response => [{ name: 'All', value: '__all' }, ...nameValue(response, 'name', 'id')])
            );
          }
        },
        {
          name: 'environment_id',
          type: ItemType.Select,
          label: 'Workspaces',
          multiple: true,
          values: () => {
            return this._environmentData.gets()
            .pipe(
              map(response => nameValue(response, 'name', 'id'))
            );
          },
        },
        {
          name: 'state',
          type: ItemType.Select,
          label: 'Status',
          multiple: true,
          values: AccountStates,
          isolate: { label: 'Show Deleted', value: State.Deleted }
        }
      ],
      actions: [
        {
          click: data => {
            this.openInvitesListDialog()
              .pipe(
                takeUntil(this._destroy$)
              )
              .subscribe(response => {
              this.table.reload();
            });
          },
          menu: false,
          label: 'View Invites',
          primary: false,
        },
        {
          click: data => {
            this.openInviteDialog('full').subscribe(response => {
              if (response) {
                this.table.reload();
              }
            });
          },
          menu: false,
          label: 'Create Account'
        },
      ],
      rowActions: [
        {
          click: data => {
            return this._authService.impersonate(data.id)
            .subscribe(() => {
              this._message.success('Successfully impersonated');
              this._router.navigateByUrl('/');
            });
          },
          label: 'Impersonate'
        },
        {
          click: data => {
            return this._accountData.delete(data);
          },
          show: data => data.state !== State.Deleted,
          remove: {
            title: 'Confirm',
            template: 'Are you sure you would like to delete this account?',
          },
          menu: true,
          label: 'Delete'
        }
      ],
      fetch: query => {
        query.workspaces = true;
        query.acl_roles = true;
        return this._accountData.gets(query, { key: null })
          .pipe(
            map(response => ({ data: response.accounts, paging: response.paging }))
          );
      },
      restore: {
        query: { state: State.Deleted },
        filterLabel: 'Show Deleted',
        menuLabel: 'Restore',
        click: (row, event) => {
          return this._accountData.put({ id: row.id, state: State.Active})
        },
        filter: false
      }
    }
  }

  public openInvitesListDialog(): Observable<any> {
    const dialogRef = this._dialog.open(InvitesListDialogComponent, {
      data: {}
    });

    return dialogRef.afterClosed();
  }

  public openInviteDialog(type = 'invite', accountRequest: AccountRequest = { id: null }): Observable<any> {
    const dialogRef = this._dialog.open(AccountRequestComponent, {
      data: { workspace_id: null, type: type, accountRequest: accountRequest }
    });

    return dialogRef.afterClosed();
  }

  public ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

  private setTitle() {
    this._navService.setListTitle('Admin', 'Accounts');
  }
}
