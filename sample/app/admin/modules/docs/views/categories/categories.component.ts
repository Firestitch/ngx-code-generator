import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';

import { Category } from '@app/shared';
import { CategoryComponent } from '../../../shared/components';
import { CategoriesListComponent } from '../../../shared/components';


@Component({
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {

  @ViewChild('list')
  public list: CategoriesListComponent = null;

  constructor(
    public dialog: MatDialog
  ) { }

  public ngOnInit() {
  }

  public onUpdate(category: Category) {
    const dialogRef = this.dialog.open(CategoryComponent, {
      data: { category },
      width: '300px'
    });

    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        this.list.list.reload();
      }
    });
  }

}
