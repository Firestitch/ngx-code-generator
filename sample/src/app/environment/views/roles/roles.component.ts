import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';

import { filter, map } from 'rxjs/operators';

import { FsListComponent, FsListConfig } from '@firestitch/list';
import { RouteObserver } from '@firestitch/core';
import { list, filter as fsFilter, sort } from '@firestitch/common';
import { ItemType } from '@firestitch/filter';

import { RoleEditComponent } from '@libs/dialogs/role-edit';
import { EnvironmentData } from '@app/core';
import { Environment, AclRole, AclRoleLevels } from '@app/shared';
import { State, AclRoleLevel } from '@app/shared/enums';


@Component({
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {

  public environment: Environment = null;

  public levelsFlatten: any = [];

  @ViewChild('list')
  public list: FsListComponent = null;
  public config: FsListConfig = null;

  public routeObserver = new RouteObserver(this._route.parent, 'environment');

  constructor(
    private _environmentData: EnvironmentData,
    private _dialog: MatDialog,
    private _route: ActivatedRoute
  ) { }

  public ngOnInit() {

    this.levelsFlatten = list(AclRoleLevels, 'name', 'value');

    this.routeObserver
      .subscribe((environment: Environment) => {
        this.environment = environment;
      });

    this.config = {
      filters: [
        {
          name: 'keyword',
          type: ItemType.Text,
          label: 'Search'
        },
        {
          name: 'level',
          type: ItemType.Select,
          label: 'Level',
          values: () => {
            return [
              { name: 'All', value: '__all' },
              ...sort(fsFilter(AclRoleLevels, level => {
                return [AclRoleLevel.Workspace, AclRoleLevel.Project].indexOf(level.value) !== -1;
              }), 'name')
            ];
          }
        }
      ],
      actions: [
        {
          label: 'Create Role',
          click: (event) => {
            this.openDialog();
          }
        }
      ],
      rowActions: [
        {
          click: data => {
            return this._environmentData.deleteRole(this.environment.id, data);
          },
          remove: {
            title: 'Confirm',
            template: 'Are you sure you would like to delete this role?',
          },
          menu: true,
          label: 'Delete'
        }
      ],
      fetch: query => {
        return this._environmentData.getRoles(this.environment.id, query, { key: null })
        .pipe(
          map(response => ({ data: response.acl_roles, paging: response.paging }))
        );
      },
      restore: {
        query: { state: State.Deleted },
        filterLabel: 'Show Deleted',
        menuLabel: 'Restore',
        click: (row) => {
          return this._environmentData.updateRole(this.environment.id, { id: row.id, state: State.Active});
        },
        filter: true
      }
    };
  }

  public openDialog(role: AclRole = { id: null, environment_id: this.environment.id }) {
    const dialogRef = this._dialog.open(RoleEditComponent, {
      width: '70%',
      data: { role: role, environment: this.environment }
    });

    dialogRef.afterClosed()
      .pipe(
        filter(response => !!response)
      )
      .subscribe(response => {
        if (role.id) {
          Object.assign(role, response);
          return;
        }
        this.list.list.reload();
      });
  }
}
