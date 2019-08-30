import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { forEach } from 'lodash-es';

import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { FsMessage } from '@firestitch/message';
import { list, email } from '@firestitch/common';

import { AccountData, ProjectData, AclRoleData, EnvironmentData } from '@app/core';
import { AccountRequest, Account, AclRole, Project } from '@app/shared/interfaces';
import { AclRoleLevel } from '@app/shared/enums';


@Component({
  templateUrl: './account-request.component.html',
  styleUrls: ['./account-request.component.scss']
})
export class AccountRequestComponent implements OnInit {

  public accountRequest: AccountRequest = {};
  public selectedAccounts: Account[] = [];

  public account: Account = {};

  public environment_id: number = null;

  public globalRoles: AclRole[] = null;
  public projectRoles: AclRole[] = null;
  public environmentRoles: AclRole[] = null;
  public selectedRoles: AclRole[] = [];

  public selectedProjects: Project[] = [];

  public mode: 'global'|'environment'|'project' = 'global';
  public type: 'invite'|'full' = 'invite';
  public action: 'invite'|'create'|'activate' = 'invite';

  public sendActivationEmail = false;

  public search = query => {
    return this._accountData.gets({ keyword: query });
  };

  public validateText = (e) => {
    return email(e);
  };

  constructor(
    private _dialogRef: MatDialogRef<AccountRequestComponent>,
    private _message: FsMessage,
    private _accountData: AccountData,
    private _environmentData: EnvironmentData,
    private _projectData: ProjectData,
    private _aclRoleData: AclRoleData,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    this.environment_id = data.environment_id ? data.environment_id : null;
    this.accountRequest = data.accountRequest ? data.accountRequest : this.accountRequest;
    this.type = data.type ? data.type : 'invite';
  }

  public ngOnInit() {

    this.mode = !this.environment_id ? 'global' : 'environment';

    if (this.environment_id) {
      this._environmentData.getRoles(this.environment_id)
      .subscribe(response => {
          this.environmentRoles = response.filter(acl_role => acl_role.level === AclRoleLevel.Workspace);
          this.projectRoles = response.filter(acl_role => acl_role.level === AclRoleLevel.Project);
      });
    } else {
      this._aclRoleData.gets().subscribe(response => this.globalRoles = response);
    }
  }

  public onActionChange(value) {
    // FS-T1105
    if (this.action !== 'invite' && value === 'invite') {
      forEach(this.selectedAccounts, (item, index) => this.selectedAccounts[index] = item.data || item);
    }

    this.action = value;
  }

  public fetchProjects = keyword => {
    return this._projectData.gets({ workspace_id: this.environment_id, keyword: keyword });
  };

  public changeMode() {
    this.selectedRoles = [];
    this.selectedProjects = [];
  }

  public save() {

    const aclRoleIds = list(this.selectedRoles, 'id');
    const requestRolesArray = [];

    if (this.selectedProjects.length && this.environment_id) {

      const requestedProjects = [];

      forEach(this.selectedProjects, project => {
        requestedProjects.push({ acl_role_ids: aclRoleIds, project_id: project.id });
      });

      requestRolesArray['projects'] = requestedProjects;

    } else {
      requestRolesArray['acl_role_ids'] = aclRoleIds;
    }

    if (this.action === 'invite') {

      if (!this.selectedAccounts.length) {
        return;
      }

      let source$ = of(true);

      forEach(this.selectedAccounts, item => {

        let email = '';
        if (item.type === 'text') {
          email = item.data;
        }

        if (item.type === 'object') {
          email = item.data.email;
        }

        const data = Object.assign(
          { email: email, workspace_id: this.environment_id },
          this.accountRequest,
          requestRolesArray
        );

        // Subscription fires 1 time. Replace switchMap with concat to fire for all queries
        source$ = source$.pipe(
          switchMap(() => this._accountData.postInvites(data))
        );
      });

      source$
        .subscribe(response => {
          this._message.success('Successfully sent invitations');
          this.close(response);
        });
    } else if (this.action === 'create' || this.action === 'activate') {

      const query = {
        first_name: this.account.first_name,
        last_name: this.account.last_name,
        email: this.account.email,
        send_activation_email: this.sendActivationEmail && this.action === 'create',
        activate: this.action === 'activate',
        workspace_id: this.environment_id
      };

      Object.assign(query, requestRolesArray);

      this._accountData.createAccount(query)
        .subscribe(response => {
          this._message.success('Successfully created account');
          this.close(response);
        });
    }
  }

  public close(data = null) {
    this._dialogRef.close(data);
  }
}
