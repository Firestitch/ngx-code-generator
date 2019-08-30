import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';

import { FsMessage } from '@firestitch/message';
import { filter, list, find, guid } from '@firestitch/common';

import { of } from 'rxjs';

import { forEach } from 'lodash-es';

import { EnvironmentData, ProjectData, AccountData, AclQueryService } from '@app/core';
import { Environment, EnvironmentAccount, Account, AclRole, Project } from '@app/shared';
import { AclRoleLevel } from '@app/shared';
import { SelectedProjectRoles } from 'app/environment/interfaces';


@Component({
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.scss']
})
export class MemberComponent implements OnInit {

  public isAdmin = false;

  public environment: Environment = null;
  public environmentAccount: EnvironmentAccount = null;

  public projects: Project[] = [];

  public access: 'environment' | 'projects' = 'environment';

  public environmentRoles: AclRole[] = [];
  public projectRoles: AclRole[] = [];

  public selectedEnvironmentRoles: AclRole[] = [];
  public selectedProjectRoles: { [key: number]: SelectedProjectRoles } = {};

  constructor(
    private _dialogRef: MatDialogRef<MemberComponent>,
    private _message: FsMessage,
    private _environmentData: EnvironmentData,
    private _aclQueryService: AclQueryService,
    private _projectData: ProjectData,
    private _accountData: AccountData,
    private _router: Router,
    @Inject(MAT_DIALOG_DATA) public data
  ) { }

  public ngOnInit() {

    this.isAdmin = this._aclQueryService.hasPermissionApp();

    this.environment = this.data.environment;

    (this.data.environmentAccount.id ?
      this._environmentData.getAccount(this.environment.id,
        { account_id: this.data.environmentAccount.account_id, acl_roles: true, acl_entries: true, accounts: true, projects: true }) :
        of(this.data.environmentAccount)
    )
      .subscribe(response => {
        this.environmentAccount = response;

        if (!this.environmentAccount.account.id) {
          this.environmentAccount.environment_id = this.environment.id;
          this.environmentAccount.account.api_key = guid('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
          this.environmentAccount.account.api_secret = guid('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
          this.environmentAccount.account.type = 'api';
        }

        if (this.environmentAccount.acl_roles && this.environmentAccount.acl_roles.length) {
          this.access = this.environmentAccount.acl_roles[0].level === AclRoleLevel.Workspace ? 'environment' : 'projects';
        }

        this.loadRoles();
        this.loadProjects();
      });
  }




  public save() {
    if (this.environmentAccount.account.id) {
      this.saveRoles();

    } else {
      this._accountData.post(this.environmentAccount.account).subscribe( account => {
        this.environmentAccount.account = account;
        this.environmentAccount.account_id = account.id;

        this._environmentData.putAccounts(this.environment.id, this.environmentAccount).subscribe( environmentAccount => {

          this.saveRoles();
        })

      });
    }
  }

  public saveRoles() {
    const data: any = {};

    switch (this.access) {
      case 'environment':
        data.acl_role_ids = list(this.selectedEnvironmentRoles, 'id');
        break;
      case 'projects':
        data.projects = Object['values'](this.selectedProjectRoles);
        break;
    }

    this._environmentData.assignRoles(this.environment.id, this.environmentAccount.account_id, data)
      .subscribe(response => {
        this._message.success('Successfully saved');
        this.close(response);
      });
  }

  public proceedAccount(account: Account) {
    this.close();
    this._router.navigateByUrl(`/admin/account/${account.id}`);
  }

  public close(data = null) {
    this._dialogRef.close(data);
  }

  private loadRoles() {
    this._environmentData.getRoles(this.environment.id, {
      projects: true,
      level: [AclRoleLevel.Workspace, AclRoleLevel.Project].join(',')
    })
      .subscribe(response => {

        this.environmentRoles = filter(response, { level: AclRoleLevel.Workspace });
        this.projectRoles = filter(response, { level: AclRoleLevel.Project });

        if (this.environmentRoles.length === 1) {
          this.selectedEnvironmentRoles.push(this.environmentRoles[0]);
        }

        this.updateSelectedEnvironmentRoles(this.environmentRoles);
      });
  }

  private updateSelectedEnvironmentRoles(roles: AclRole[]) {
    forEach(roles, aclRole => {
      const data = find(this.environmentAccount.acl_entries, { acl_role_id: aclRole.id });
      if (data) {
        this.selectedEnvironmentRoles.push(aclRole);
      }
    });
  }

  private loadProjects() {
    this._projectData.gets({ workspace_id: this.environment.id })
      .subscribe(response => {
        this.projects = response;
        this.updateSelectedProjectRoles(this.projects);
      });
  }

  private updateSelectedProjectRoles(projects: Project[]) {
    this.selectedProjectRoles = {};
    forEach(projects, project => {
      this.selectedProjectRoles[project.id] = { project_id: project.id, acl_role_ids: [] };
    });

    forEach(this.selectedProjectRoles, item => {
      item.acl_role_ids = list(filter(this.environmentAccount.acl_entries, { object_id: item.project_id }), 'acl_role_id');
    });
  }

}
