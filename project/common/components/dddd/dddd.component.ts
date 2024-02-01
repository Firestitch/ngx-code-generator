import { Component, Inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { of } from 'rxjs';
import { tap } from 'rxjs/operators';


@Component({
  templateUrl: './dddd.component.html',
  styleUrls: ['./dddd.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DdddComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private _dialogRef: MatDialogRef<DdddComponent>,
    private _cdRef: ChangeDetectorRef,
  ) {}

  public close(value?): void {
    this._dialogRef.close(value);
  }

  public save = () => {
    return of(true)
      .pipe(
        tap((response) => {
          this._dialogRef.close(response);
        }),
      );
  }

}
