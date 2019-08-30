import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';

import { Observable, Subject } from 'rxjs';
import { filter, map, takeUntil, tap } from 'rxjs/operators';

import { forEach, uniqBy } from 'lodash-es';

import { FsListComponent, FsListConfig } from '@firestitch/list';
import { nameValue } from '@firestitch/common';
import { RouteObserver } from '@firestitch/core';
import { ItemType } from '@firestitch/filter';

import { EnvironmentData, AuthService, AccountData } from '@app/core';
import { Environment, AccountRequest, EnvironmentAccount, Account } from '@app/shared';

import { AccountRequestComponent, InvitesListDialogComponent } from '@libs/dialogs/invites-list';
import { MemberComponent } from '../../components';


@Component({
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss']
})
export class MembersComponent implements OnInit, OnDestroy {

  @ViewChild('list')
  public list: FsListComponent = null;
  public config: FsListConfig = null;

  public accountType = 'person';
  public environment: Environment = null;
  public loggedInAccount: Account = null;

  public routeObserver = new RouteObserver(this._route.parent, 'environment');

  private _destroy$ = new Subject();

  constructor(
    private _environmentData: EnvironmentData,
    private _dialog: MatDialog,
    private _route: ActivatedRoute,
    private _authService: AuthService,
    private _accountData: AccountData,
  ) { }

  public ngOnInit() {

    this._route.data.subscribe( data => {
      if (data.accountType) {
        this.accountType = data.accountType;
      }
    });

    this.routeObserver
      .subscribe((environment: Environment) => {
        this.environment = environment;
      });

    this._authService.loggedInAccount$
      .pipe(takeUntil(this._destroy$))
      .subscribe(data => {
        this.loggedInAccount = this._accountData.create(data.value);
      });


    this.initConfig();
  }

  public ngOnDestroy() {
    this.routeObserver.destroy();
    this._destroy$.next();
    this._destroy$.complete();
  }

  public openInviteDialog(
    environment_id: number,
    type = 'invite',
    accountRequest: AccountRequest = { id: null }
    ): Observable<any> {
      const dialogRef = this._dialog.open(AccountRequestComponent, {
        width: '600px',
        data: {
          environment_id: environment_id,
          type: type,
          accountRequest: accountRequest
        }
      });

      return dialogRef.afterClosed();
    }

  public openMemberDialog(environmentAccount: EnvironmentAccount = { id: null }) {
    const dialogRef = this._dialog.open(MemberComponent, {
      width: '800px',
      data: {
        environmentAccount: environmentAccount,
        environment: this.environment
      }
    });

    dialogRef.afterClosed()
      .pipe(
        filter(response => !!response),
        takeUntil(this._destroy$)
      )
      .subscribe(response => this.list.reload());
  }

  public openInvitesListDialog() {
    const dialogRef = this._dialog.open(InvitesListDialogComponent, {
      data: {
        environmentId: this.environment.id
      }
    });

    return dialogRef.afterClosed();
  }

  private initConfig() {
    this.config = {
      filters: [
        {
          name: 'keyword',
          type: ItemType.Text,
          label: 'Search'
        },
        {
          name: 'acl_role_id',
          type: ItemType.Select,
          label: 'Role',
          values: () => {
            return this._environmentData.getRoles(this.environment.id)
              .pipe(
                map((response) =>
                  [{ name: 'All', value: '__all' }, ...nameValue(response, 'name', 'id')]
                ),
                takeUntil(this._destroy$)
              );
          }
        }
      ],
      actions: [],
      rowActions: [],
      fetch: query => {
        query.acl_roles = true;
        query.accounts = true;
        query.projects = true;
        query.account_type = this.accountType;

        return this._environmentData.getAccounts(this.environment.id, query, { key: null })
          .pipe(
            map(response => {
              forEach(response.environment_accounts, value => {
                value.projects_count = value.projects.length;
                value.projects = value.projects.slice(0, 2);
                value.acl_roles = uniqBy(value.acl_roles, item => item.id);
              });
              return response;
            }),
            map(response => ({ data: response.environment_accounts, paging: response.paging })),
            takeUntil(this._destroy$)
          );
      },
    };

    if (this.accountType === 'person') {
      this.addActionsForPersonType();
    } else if (this.accountType === 'api') {
      this.addActionsForAPIType();
    }
  }

  private addActionsForPersonType() {
    this.config.actions = [
      {
        click: data => {
          this.openInvitesListDialog()
            .pipe(
              takeUntil(this._destroy$)
            )
            .subscribe(response => {
              this.list.reload();
            });
        },
        menu: false,
        label: 'View Invites',
        primary: false,
      },
      {
        label: 'Invite People',
        click: data => {
          this.openInviteDialog(this.environment.id, 'full')
            .pipe(
              takeUntil(this._destroy$)
            )
            .subscribe(response => {
              if (response) {
                this.list.reload();
              }
          });
        },
      },
    ];

    this.config.rowActions = [
      {
        click: data => {
          return this._environmentData.deleteAccounts(this.environment.id, data)
            .pipe(
              tap(response => {
                  if (data.account_id === this.loggedInAccount.id) {
                    this._authService.signout();
                  }
                }
              )
            )
        },
        remove: {
          title: 'Confirm',
          template: 'Are you sure you would like to delete this member?',
        },
        menu: true,
        label: 'Remove Member'
      }
    ];
  }

  private addActionsForAPIType() {
    this.config.actions = [
      {
        label: 'Create API Key',
        click: data => {
          this.openMemberDialog({
            id: null,
            acl_entries: [],
            account: { id: null, image: {}, type: this.accountType }
          });
        },
      }
    ];

    this.config.rowActions = [
      {
        menu: true,
        label: 'Edit API Key Roles',
        click: row => {
          this.openMemberDialog(row);
        }
      },
      {
        click: data => {
          return this._environmentData.deleteAccounts(this.environment.id, data);
        },
        remove: {
          title: 'Confirm',
          template: 'Are you sure you would like to delete this API Key?',
        },
        menu: true,
        label: 'Remove API Key'
      }
    ];
  }

}
