import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';

import { Type } from '@app/shared';
import { TypesListComponent } from '../../../shared/components';


@Component({
  templateUrl: './types.component.html',
  styleUrls: ['./types.component.scss']
})
export class TypesComponent implements OnInit {

  @ViewChild('list')
  public list: TypesListComponent = null;

  constructor(
    public dialog: MatDialog
  ) { }

  public ngOnInit() {
  }

  public openDialog(type: Type = { id: null }) {
    const dialogRef = this.dialog.open(TypesComponent, {
      data: { type: type }
    });

    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        this.list.list.reload();
      }
    });
  }

}
