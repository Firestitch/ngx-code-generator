import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';

import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

import { forEach } from 'lodash-es';

import { differenceInSeconds, parseISO, startOfDay } from 'date-fns';

import { FsListComponent, FsListConfig } from '@firestitch/list';
import { list, nameValue } from '@firestitch/common';
import { ItemType } from '@firestitch/filter';

import { AccountData, EnvironmentData, AclQueryService } from '@app/core';
import { AccountRequest } from '@app/shared/interfaces';
import { State } from '@app/shared/enums';
import { AccountRequestStates } from '@app/shared/consts';
import { AccountRequestComponent } from '../account-request/account-request.component';



@Component({
  templateUrl: './invites-list.component.html',
  styleUrls: ['./invites-list.component.scss']
})
export class InvitesListDialogComponent implements OnInit, OnDestroy {

  @ViewChild('list')
  public list: FsListComponent = null;
  public config: FsListConfig = null;

  public statesFlatten = null;
  public environmentId: number;
  public hasPermissionApp = false;

  private _destroy$ = new Subject();

  constructor(
    private _dialogRef: MatDialogRef<InvitesListDialogComponent>,
    private _dialog: MatDialog,
    private _accountData: AccountData,
    private _environmentData: EnvironmentData,
    private _aclQueryService: AclQueryService,
    @Inject(MAT_DIALOG_DATA) public data
  ) { }

  public ngOnInit() {
    this.hasPermissionApp = this._aclQueryService.hasPermissionApp();
    this.statesFlatten = list(AccountRequestStates, 'name', 'value');
    this.environmentId = this.data.environmentId || null;

    this.initListConfig();
  }

  public ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public openInviteDialog(accountRequest: AccountRequest = { id: null }) {
    const dialogRef = this._dialog.open(AccountRequestComponent, {
      width: '30%',
      data: { accountRequest, environment_id: this.environmentId }
    });

    dialogRef.afterClosed()
      .pipe(
        takeUntil(this._destroy$)
      )
      .subscribe(response => {
      if (response) {
        this.list.reload();
      }
    });
  }

  public close(data = null) {
    this._dialogRef.close(data);
  }

  private initListConfig() {
    this.config = {
      sort: 'create_date,desc',
      filters: [
        {
          name: 'keyword',
          type: ItemType.Text,
          label: 'Search'
        },
        {
          name: 'state',
          type: ItemType.Select,
          label: 'Status',
          multiple: true,
          values: AccountRequestStates,
          isolate: { label: 'Show Deleted', value: 'deleted' }
        },
      ],
      actions: [
        {
          click: (event) => {
            this.openInviteDialog();
          },
          label: 'Invite People'
        }
      ],
      rowActions: [
        {
          menu: true,
          label: 'Resend Invite',
          show: data => data.state !== State.Deleted,
          click: row => {
            this._accountData.resendInvite(row.id)
              .pipe(
                takeUntil(this._destroy$)
              )
              .subscribe(
              response => {
                this.list.reload();
              }
            );
          }
        },
        {
          click: data => {
            return this._accountData.deleteInvites(data);
          },
          show: data => data.state !== State.Deleted,
          remove: {
            title: 'Confirm',
            template: 'Are you sure you would like to delete this request?',
          },
          menu: true,
          label: 'Delete'
        }
      ],
      fetch: query => {
        query.creator_accounts = true;
        query.environments = true;

        if (this.environmentId) {
          query.environment_id = this.environmentId;
        }

        return this._accountData.getsInvites(query, { key: null })
          .pipe(
            map(response => {
              forEach(response.account_requests, item => {
                item.expires = differenceInSeconds(startOfDay(parseISO(item.expiry_date)), startOfDay(new Date()));
              });
              return response;
            }),
            map(response => ({ data: response.account_requests, paging: response.paging })),
            takeUntil(this._destroy$)
          );
      }
    };

    if (!this.environmentId) {
      this.addWorkspaceFilter();
    }
  }

  private addWorkspaceFilter() {
    const workspaceFilter =  {
      name: 'environment_id',
      type: ItemType.Select,
      multiple: true,
      label: 'Workspace',
      values: () => {
        return this._environmentData.gets()
          .pipe(
            map((response) =>
              [{ name: 'All', value: '__all' }, ...nameValue(response, 'name', 'id')]
            ),
            takeUntil(this._destroy$)
          );
      }
    };

    this.config.filters.splice(1, 0, workspaceFilter)
  }

}
