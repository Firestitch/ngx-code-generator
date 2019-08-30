import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { forEach } from 'lodash-es';

import { forkJoin, of } from 'rxjs';
import { Observable } from 'rxjs';

import { FsMessage } from '@firestitch/message';
import { find, list } from '@firestitch/common';
import { FsPrompt } from '@firestitch/prompt';

import { AclRoleData, AclEntryData, AclQueryService } from '@app/core';
import { Account, AclRoleLevel, AclEntry, AclRole } from '@app/shared';


@Component({
  templateUrl: './account-role.component.html',
  styleUrls: ['./account-role.component.scss']
})
export class AccountRoleComponent implements OnInit {

  public account: Account = null;
  public aclRoles: AclRole[] = [];
  public selectedAclRoles: AclRole[] = [];
  public aclRoleLevel = AclRoleLevel;
  public accountAclEntries: AclEntry[] = [];

  constructor(
    private _dialogRef: MatDialogRef<AccountRoleComponent>,
    private _message: FsMessage,
    private _aclRoleData: AclRoleData,
    private _aclEntryData: AclEntryData,
    private _aclQueryService: AclQueryService,
    private _prompt: FsPrompt,
    @Inject(MAT_DIALOG_DATA) public data
  ) { }

  public ngOnInit() {
    this.account = this.data.account;

    this._aclRoleData.gets({
      //level: [AclRoleLevel.System, AclRoleLevel.App].join(',')
    })
      .subscribe(response => {
        this.aclRoles = response.map(aclRole => {
          if (aclRole.level === AclRoleLevel.System && !this._aclQueryService.hasPermissionSystem()) {
            aclRole.disabled = true;
          }

          return aclRole;
        });

        this.loadAccountAclEntries();
      });
  }

  public save() {
    const selectedRoles: AclRole[] = [];
    const deletedEntries: AclEntry[] = [];
    const queries$ = [of(true)];

    forEach(this.aclRoles, aclRole => {
      const existedAclEntry = find(this.accountAclEntries, { acl_role_id: aclRole.id });
      const isAclRoleSelected = !!find(this.selectedAclRoles, { id: aclRole.id });

      if (existedAclEntry && !isAclRoleSelected) {
        deletedEntries.push(existedAclEntry);
      } else if (!existedAclEntry && isAclRoleSelected) {
        selectedRoles.push(aclRole);
      }
    });

    forEach(selectedRoles, item => {
      queries$.push(this._aclEntryData.save({
        id: null,
        account_id: this.account.id,
        acl_role_id: item.id
      }));
    });

    forEach(deletedEntries, item => {
      queries$.push(this._aclEntryData.delete(item));
    });

    Observable.create(observer => {
      if (!deletedEntries.length) {
        observer.next();
        observer.complete();
        return;
      }

      this._prompt.confirm({
        title: 'Confirm',
        template: `Are you sure you would like to remove ${list(list(deletedEntries, 'acl_role'), 'name').join(', ')} from this account?`
      }).subscribe(() => {
        observer.next();
        observer.complete();
      });
    })
      .subscribe(() => {
        forkJoin(...queries$)
          .subscribe(response => {
            this._message.success('Saved Changes');
            this.close(true);
          });
      });
  }

  public close(data = null) {
    this._dialogRef.close(data);
  }

  private loadAccountAclEntries() {
    this._aclEntryData.gets({
      account_id: this.account.id,
      workspace_id: false,
      accounts: true,
      acl_roles: true,
      workspaces: true
    })
      .subscribe(response => {
        this.accountAclEntries = response;
        this.updateSelectedAclRoles(this.accountAclEntries);
      });
  }

  private updateSelectedAclRoles(aclEntries: AclEntry[]) {
    this.selectedAclRoles = [];
    forEach(aclEntries, aclEntry => {
      const data = find(this.aclRoles, { id: aclEntry.acl_role_id });
      if (data) {
        this.selectedAclRoles.push(data);
      }
    });
  }

}
