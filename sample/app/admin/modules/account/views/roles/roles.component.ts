import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';

import { of } from 'rxjs';

import { sortBy, forEach, groupBy, forOwn } from 'lodash-es';

import { FsListComponent, FsListConfig } from '@firestitch/list';
import { list } from '@firestitch/common';
import { RouteObserver } from '@firestitch/core';
import { FsMessage } from '@firestitch/message';

import { AclEntryData, AccountData, AclRoleData, RoleData } from '@app/core';
import { State, AclEntry, Account } from '@app/shared';
import { AccountRoleComponent } from 'app/admin/modules/shared';
import { AclRoleAccesses } from 'app/shared';
import { AclRoleService } from 'app/core';


@Component({
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit, OnDestroy {

  @ViewChild('listAdminRoles')
  public listAdminRoles: FsListComponent = null;
  public configAdminRoles: FsListConfig = null;

  public account: Account = null;

  public aclEntries: AclEntry[] = [];

  public permissions: any[] = [];
  public groupedPermissions: any[] = [];

  public accesses: any[] = [];
  public accessesFlatten = null;

  public routeObserver = new RouteObserver(this._route.parent, 'account');

  constructor(
    private _aclEntryData: AclEntryData,
    private _accountData: AccountData,
    private _aclRoleData: AclRoleData,
    private _aclRoleService: AclRoleService,
    private _route: ActivatedRoute,
    private _message: FsMessage,
    public dialog: MatDialog
  ) {
    this.accesses = AclRoleAccesses;
    this.accessesFlatten = list(AclRoleAccesses, 'name', 'value');
  }

  public ngOnInit() {

    this._aclRoleData.permissions()
      .subscribe(response => {
        this.permissions = response;
        this.groupedPermissions = this._aclRoleService.groupPermissions(this.permissions);
      });

    this.routeObserver
      .subscribe(account => {
        this.account = this._accountData.create(account);
        this.loadData();
      });

    this.configAdminRoles = {
      filters: [],
      actions: [],
      status: false,
      paging: false,
      scrollable: false,
      initialFetch: false,
      fetch: query => {
        let data = [];
        forOwn(groupBy(this.aclEntries, 'object_id'), (aclEntries, object_id) => {
          const object = aclEntries[0].object;
          data.push({ object: object, aclEntries: aclEntries });
        });

        data = sortBy(data, (item) => {
          return item.object ? item.object.name : '';
        });

        return of({ data: data });
      }
    };
  }

  public loadData() {
    this._aclEntryData.gets({
        account_id: this.account.id,
        workspace_id: false,
        accounts: true,
        acl_roles: true,
        environments: true,
        objects: true,
        acl_roles_state: State.Active
      })
      .subscribe(response => {

        forEach(response, (entry: AclEntry) => {
            entry.acl_role['access'] = this._aclRoleService.getAccess(this.permissions, entry.acl_role);
            entry.acl_role['inheritsCount'] = this._aclRoleService.getInheritsCount(this.permissions, entry.acl_role);
        });

        this.aclEntries = response;
        this.listAdminRoles.reload();
      });
  }

  public update(data) {
    const dialogRef = this.dialog.open(AccountRoleComponent, {
      data: {
        account: this.account
      }
    });

    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        this.loadData();
      }
    });
  }

  public ngOnDestroy() {
    this.routeObserver.destroy();
  }

}
