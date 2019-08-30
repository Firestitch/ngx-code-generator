import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { FsMessage } from '@firestitch/message';

import { CategoryData } from '@app/core';
import { Category } from '@app/shared';


@Component({
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  public category: Category = null;

  constructor(
    private _dialogRef: MatDialogRef<CategoryComponent>,
    private _message: FsMessage,
    private _categoryData: CategoryData,
    @Inject(MAT_DIALOG_DATA) public data
  ) { }

  public ngOnInit() {
    this.category = Object.assign({}, this._categoryData.create(this.data.category));
  }

  public save() {
    this._categoryData.save(this.category)
      .subscribe(response => {
        this._message.success('Saved Changes');
        this.close(response);
      });
  }

  public close(data = null) {
    this._dialogRef.close(data);
  }

}
