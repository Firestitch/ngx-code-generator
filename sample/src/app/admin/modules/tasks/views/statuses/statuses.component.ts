import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';

import { Status } from '@app/shared';
import { StatusComponent } from '../../../shared/components';
import { StatusesListComponent } from '../../../shared';


@Component({
  templateUrl: './statuses.component.html',
  styleUrls: ['./statuses.component.scss']
})
export class StatusesComponent implements OnInit {

  @ViewChild('list')
  public list: StatusesListComponent = null;

  constructor(
    public dialog: MatDialog
  ) { }

  public ngOnInit() {
  }

  public onUpdate(status: Status = { id: null }) {
    const dialogRef = this.dialog.open(StatusComponent, {
      data: { status },
      width: '300px'
    });

    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        this.list.list.reload();
      }
    });
  }

}
