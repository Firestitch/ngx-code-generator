import { Component, inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

import { of } from 'rxjs';
import { tap } from 'rxjs/operators';

import { FsDialogModule } from '@firestitch/dialog';
import { FsListModule } from '@firestitch/list';
import { FsFormModule } from '@firestitch/form';
import { FsSkeletonModule } from '@firestitch/skeleton';


@Component({
  templateUrl: './<%=dasherize(name)%>.component.html',
  styleUrls: ['./<%=dasherize(name)%>.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatInputModule,

    FsDialogModule,
    FsListModule,
    FsFormModule,
    FsSkeletonModule,
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
