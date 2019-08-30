import { Component, Inject, ViewChild, OnInit, Optional } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { ObjectService } from '@app/core';
import { Object } from '@app/shared';


@Component({
  templateUrl: './search-dialog.component.html',
  styleUrls: ['./search-dialog.component.scss']
})
export class SearchDialogComponent implements OnInit {

  constructor(
    private _objectService: ObjectService,
    private _dialogRef: MatDialogRef<SearchDialogComponent>,
    private _router: Router,
    @Optional() @Inject(MAT_DIALOG_DATA) public data,
  ) { }

  public ngOnInit() {
  }

  public navigateTo(object: Object) {
    this.close();
    this._objectService.navigate(object);
  }

  public close(data = null) {
    this._dialogRef.close(data);
  }

  public viewAll() {
    this.close();
  }

}
