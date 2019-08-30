import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';

import { filter, map } from 'rxjs/operators';

import { FsListComponent, FsListConfig } from '@firestitch/list';
import { FsPrompt } from '@firestitch/prompt';
import { ItemType } from '@firestitch/filter';
import { list } from '@firestitch/common';

import { AclRoleData, NavService } from '@app/core';
import { AclRole, AclRoleLevel, State, AclRoleLevels } from '@app/shared';
import { RoleEditComponent } from '@libs/dialogs/role-edit';


@Component({
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {

  @ViewChild('list')
  public list: FsListComponent = null;
  public config: FsListConfig = null;

  public levelsFlatten: any = {};

  constructor(
    private _router: Router,
    private _dialog: MatDialog,
    private _aclRoleData: AclRoleData,
    private _prompt: FsPrompt,
    private _navService: NavService
  ) { }

  ngOnInit() {

    this.levelsFlatten = list(AclRoleLevels, 'name', 'value');

    this.config = {
      filters: [
        {
          name: 'keyword',
          type: ItemType.Keyword,
          label: 'Search'
        },
        {
          name: 'level',
          label: 'Level',
          type: ItemType.Select,
          values: AclRoleLevels.filter((level) => {
            return level.value === AclRoleLevel.System || level.value === AclRoleLevel.App
          })
        },
        {
          name: 'state',
          label: 'Show Deleted',
          type: ItemType.Checkbox,
          unchecked: State.Active,
          checked: State.Deleted
        },
      ],
      actions: [
        {
          click: (event) => {
            this.openDialog();
          },
          label: 'Create Role'
        }
      ],
      rowActions: [
        {
          click: data => {
            return this._aclRoleData.delete(data);
          },
          remove: {
            title: 'Confirm',
            template: 'Are you sure you would like to delete this role?',
          },
          menu: true,
          label: 'Delete',
          show: row => row.state !== State.Deleted
        }
      ],
      fetch: query => {
        return this._aclRoleData.gets(query, { key: null })
          .pipe(
            map(response => ({ data: response.acl_roles, paging: response.paging }))
          );
      }
    }
  }

  public openDialog(role: AclRole = { id: null }) {
    const dialogRef = this._dialog.open(RoleEditComponent, {
      width: '70%',
      data: { role }
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
