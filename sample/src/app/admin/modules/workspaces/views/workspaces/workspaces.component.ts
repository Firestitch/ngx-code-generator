import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';

import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { FsListComponent, FsListConfig } from '@firestitch/list';
import { FsPrompt } from '@firestitch/prompt';

import { EnvironmentData, NavService } from '@app/core';
import { WorkspaceCreateComponent } from '@libs/dialogs/workspace-create';
import { AccountRequestComponent } from '@libs/dialogs/invites-list';

import { AccountRequest } from '@app/shared';
import { Workspace } from '@app/shared';
import { ItemType } from '@firestitch/filter';
import { State } from '@app/shared';


@Component({
  templateUrl: './workspaces.component.html',
  styleUrls: ['./workspaces.component.scss']
})
export class WorkspacesComponent implements OnInit {

  @ViewChild('table')
  public table: FsListComponent = null;
  public config: FsListConfig = null;

  constructor(
    private _router: Router,
    private _environmentData: EnvironmentData,
    private _dialog: MatDialog,
    private _navService: NavService
  ) { }

  ngOnInit() {

    this._navService.setTitle('Workspaces');

    this.config = {
      filters: [
        {
          name: 'keyword',
          type: ItemType.Keyword,
          label: 'Search'
        }
      ],
      actions: [
        {
          click: (event) => {
            this.open();
          },
          label: 'Create Workspace'
        }
      ],
      rowActions: [
        {
          click: data => {
            this.openInviteDialog(data.id)
              .subscribe(response => {
                if (response) {
                  this.table.reload();
                }
              });
          },
          menu: true,
          label: 'Invite People'
        },
        {
          click: data => {
            this.openInviteDialog(data.id, 'full').subscribe(response => {
              if (response) {
                this.table.reload();
              }
            });
          },
          menu: true,
          label: 'Create Account'
        },
        {
          click: data => {
            return this._environmentData.delete(data);
          },
          remove: {
            title: 'Confirm',
            template: 'Are you sure you would like to delete this workspace?',
          },
          menu: true,
          label: 'Delete'
        }
      ],
      fetch: query => {
        return this._environmentData.gets(query, { key: null })
          .pipe(
            map(response => ({ data: response._environments, paging: response.paging }))
          );
      },
      restore: {
        query: { state: State.Deleted },
        filterLabel: 'Show Deleted',
        menuLabel: 'Restore',
        click: (row, event) => {
          return this._environmentData.put({ id: row.id, state: State.Active })
        },
        reload: true
      }
    }
  }

  public open(workspace: Workspace = { id: null }) {
    const dialogRef = this._dialog.open(WorkspaceCreateComponent, {
      width: '700px',
      data: { workspace: workspace }
    });

    dialogRef.afterClosed()
      .pipe(
        filter(response => !!response)
      )
      .subscribe(response => {
        if (response.id) {
          this._router.navigate(['workspace', response.id, 'settings']);
        }
      });
  }

  public openInviteDialog(
    workspace_id: number,
    type = 'invite',
    accountRequest: AccountRequest = { id: null }
    ): Observable<any> {
    const dialogRef = this._dialog.open(AccountRequestComponent, {
      width: '600px',
      minWidth: '300px',
      data: { environment_id: workspace_id, type: type, accountRequest: accountRequest }
    });

    return dialogRef.afterClosed();
  }

}
