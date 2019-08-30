import { Component, Inject } from '@angular/core';
import { MENU_DATA, SidenavMenuRef } from '@firestitch/sidenav';
import { MatDialog } from '@angular/material';

import { Router } from '@angular/router';

import { filter } from 'rxjs/operators';

import { WorkspaceCreateComponent } from '@libs/dialogs/workspace-create';
import { EnvironmentSwitchComponent } from '../environment-switch/environment-switch.component';


@Component({
  templateUrl: './environment-menu.component.html',
  styleUrls: ['./environment-menu.component.scss']
})
export class EnvironmentMenuComponent {

  public workspace;

  constructor(public dialog: MatDialog,
              public router: Router,
              public menuRef: SidenavMenuRef<EnvironmentMenuComponent>,
              @Inject(MENU_DATA) public data) {
                this.workspace = data.workspace;
              }

  public close() {
    this.menuRef.close();
  }

  public create() {

    this.close();

    const dialogRef = this.dialog.open(WorkspaceCreateComponent, {
      width: '700px',
      data: { workspace: { id: null } }
    });

    dialogRef.afterClosed()
      .pipe(
        filter(response => !!response)
      )
      .subscribe(response => {
        if (response.id) {
          this.router.navigate(['workspace', response.id, 'settings']);
        }
      });
  }

  public switch() {
    this.close();
    const dialogRef = this.dialog.open(EnvironmentSwitchComponent, {
      data: {},
      // panelClass: 'environment-switch-dialog'
    });
    dialogRef.afterClosed().subscribe(response => {});
  }
}
