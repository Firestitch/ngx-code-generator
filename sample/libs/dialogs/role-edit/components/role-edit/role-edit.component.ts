import { Component, Inject, OnInit, ViewChild, AfterContentInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { FsMessage } from '@firestitch/message';
import { filter, list } from '@firestitch/common';
import { FsListConfig, FsListComponent } from '@firestitch/list';

import { of, Observable, forkJoin } from 'rxjs';

import { forEach } from 'lodash-es';

import { AclRole, Environment } from '@app/shared/interfaces';
import { AclRoleData, EnvironmentData, AclRoleService, AclQueryService } from '@app/core';
import { AclRoleLevel } from '@app/shared/enums';
import { AclRoleLevels, AclRoleAccesses } from '@app/shared/consts';


@Component({
  selector: 'app-role-edit',
  templateUrl: './role-edit.component.html',
  styleUrls: ['./role-edit.component.scss']
})
export class RoleEditComponent implements OnInit, AfterContentInit {

  @ViewChild('list') list: FsListComponent;

  public role: AclRole = null;
  public environment: Environment = null;

  public permissions: any[] = [];
  public listConfig: FsListConfig;

  public accesses: any[] = [];
  public accessesFlatten = null;
  public levels: any[] = [];
  public onlyFullAccess = false;

  constructor(
    private _dialogRef: MatDialogRef<RoleEditComponent>,
    private _message: FsMessage,
    private _aclRoleData: AclRoleData,
    private _aclRoleService: AclRoleService,
    private _aclQueryService: AclQueryService,
    private _environmentData: EnvironmentData,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    this.accesses = AclRoleAccesses;
    this.accessesFlatten = list(AclRoleAccesses, 'name', 'value');
  }

  public ngOnInit() {

    this.listConfig = {
      status: false,
      initialFetch: false,
      scrollable: false,
      noResults: {
        message: ''
      },
      fetch: (query) => {
        const group = filter(this._aclRoleService.groupPermissions(this.permissions), { level: this.role.level });
        const permissions = group[0] ? group[0].permissions : [];
        return of({ data: permissions });
      }
    }

    this.environment = this.data.environment;
    this.levels = filter(AclRoleLevels, level => {
      if(this.environment) {
        return [
                  AclRoleLevel.Workspace,
                  AclRoleLevel.Project
                ].indexOf(level.value) !== -1;
      }

      return [
              AclRoleLevel.System,
              AclRoleLevel.App,
            ].some(item => {

              if (item === AclRoleLevel.System && !this._aclQueryService.hasPermissionSystem()) {
                return false;
              }

              return level.value === item;
            });
    });

  }

  public ngAfterContentInit() {

    forkJoin(
      this.getRole(),
      this._aclRoleData.permissions()
    )
      .subscribe(response => {

        this.role = Object.assign({}, this._aclRoleService.create(response[0]));
        this.permissions = response[1];
        forEach(this.permissions, item => {
          this.role.permissions[item.value] = this.role.permissions[item.value] || 0;
        });
        this.updatePermissions();

        setTimeout(() => {
          this.list.reload();
        });
      });
  }

  public levelChanged() {
    this.list.reload();
    this.updatePermissions();
  }

  public getRole(): Observable<any> {

    if (!this.data.role.id) {
      return of(this.data.role);
    }

    if (this.environment) {
      return this._environmentData.getRole(this.environment.id, this.data.role.id);
    } else {
      return this._aclRoleData.get(this.data.role.id);
    }
  }

  public save() {
    const selectedLevelPermissions = filter(this.permissions, { level: this.role.level });
    let isEmpty = true;

    for (const key in this.role.permissions) {
      if (this.role.permissions.hasOwnProperty(key)) {
        if (!selectedLevelPermissions.find(selectedLevelPermission => selectedLevelPermission.value === key )) {
          this.role.permissions[key] = 0;
        }
      }
    }

    for (const selectedLevelPermission of selectedLevelPermissions) {
      if (this.role.permissions[selectedLevelPermission.value]) {
        this.role.permissions = selectedLevelPermission.inherits
          ? Object.assign({}, this.role.permissions, selectedLevelPermission.inherits)
          : this.role.permissions;
        isEmpty = false;
      }
    }

    if (isEmpty) {
      this._message.error(`This role needs at least one permission`);
      return;
    }

    const request$ = this.environment
      ? this._environmentData.saveRole(this.environment.id, this.role)
      : this._aclRoleData.save(this.role);

    request$
      .subscribe(response => {
        this._message.success(`Role successfully saved`);
        this.close(response);
      });
  }

  public close(data = null) {
    this._dialogRef.close(data);
  }

  public updatePermissions() {

    const selectedLevelPermissions = filter(this.permissions, { level: this.role.level });

    forEach(selectedLevelPermissions, selectedLevelPermission => {
      if (this.role.all_permissions) {
        this.role.permissions[selectedLevelPermission.value] = this.getMaxAccess(selectedLevelPermission);
      }
    });
  }

  private getMaxAccess(permission) {
    return Math.max(...permission.accesses);
  }

}
