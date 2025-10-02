import { Component, inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';

import { of } from 'rxjs';
import { tap } from 'rxjs/operators';

import { FsDialogModule } from '@firestitch/dialog';
import { FsFormModule } from '@firestitch/form';
import { FsSkeletonModule } from '@firestitch/skeleton';


@Component({
  templateUrl: './<%=dasherize(name)%>.component.html',
  styleUrls: ['./<%=dasherize(name)%>.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatDialogContent,
    MatDialogActions,
    FsFormModule,
    MatLabel,
    MatFormField,
    MatInput,
    FsSkeletonModule,
    FsDialogModule,
  ]
})
export class <%= classify(name) %>Component {

  private _data: any = inject(MAT_DIALOG_DATA);
  private _dialogRef: MatDialogRef<<%= classify(name) %>Component> = inject(MatDialogRef);
  private _cdRef = inject(ChangeDetectorRef);

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
