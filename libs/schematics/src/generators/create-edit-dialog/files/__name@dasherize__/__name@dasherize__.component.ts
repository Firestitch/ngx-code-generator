import {
  Component,
  inject,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  DestroyRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';

import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

import { FsMessage } from '@firestitch/message';
import { FsListModule } from '@firestitch/list';
import { FsDialogModule } from '@firestitch/dialog';
import { FsFormModule } from '@firestitch/form';
import { FsSkeletonModule } from '@firestitch/skeleton';

import { of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

import { <%= classify(serviceName) %> } from '<%= relativeServicePath %>';


@Component({
  templateUrl: './<%=dasherize(name)%>.component.html',
  styleUrls: ['./<%=dasherize(name)%>.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    FsListModule,
    FsDialogModule,
    FsFormModule,
    FsSkeletonModule,
  ],
})
export class <%= classify(name) %>Component implements OnInit {

  public <%= camelize(singleModel) %>;

  private readonly _data = inject(MAT_DIALOG_DATA);

  private readonly _dialogRef: MatDialogRef<<%= classify(name) %>Component> = inject(MatDialogRef);
  private readonly _message = inject(FsMessage);
  private readonly _<%= camelize(serviceName) %> = inject(<%= classify(serviceName) %>);
  private readonly _cdRef = inject(ChangeDetectorRef);
  private readonly _destroyRef = inject(DestroyRef);

  public ngOnInit(): void {
    this._fetchData();
  }

  public save = () => {
    return this._<%= camelize(serviceName) %>.save(this.<%= camelize(singleModel) %>)
      .pipe(
        tap((<%= camelize(singleModel) %>) => {
          this._message.success('Saved Changes');
          this._dialogRef.close(<%= camelize(singleModel) %>);
        }),
      );
  };

  public close(value?): void {
    this._dialogRef.close(value);
  }

  private _fetchData(): void {
    of(this._data.<%= camelize(singleModel) %>)
      .pipe(
        switchMap((<%= camelize(singleModel) %>) => {
          return <%= camelize(singleModel) %>.id
            ? this._<%= camelize(serviceName) %>.get(<%= camelize(singleModel) %>.id)
            : of(<%= camelize(singleModel) %>);
        }),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe((<%= camelize(singleModel) %>) => {
        this.<%= camelize(singleModel) %> = { ...<%= camelize(singleModel) %> };

        this._cdRef.markForCheck();
      });
  }

}
