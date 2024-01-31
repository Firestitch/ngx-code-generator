import {
  Component,
  Inject,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { FsMessage } from '@firestitch/message';

import { Subject, of } from 'rxjs';
import { switchMap, tap, takeUntil } from 'rxjs/operators';

import { DogData } from '../../../../../../common/data/dog.data';


@Component({
  templateUrl: './dog.component.html',
  styleUrls: ['./dog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DogComponent implements OnInit, OnDestroy {

  public dog;

  private _destroy$ = new Subject<void>();

  constructor(
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private _dialogRef: MatDialogRef<DogComponent>,
    private _message: FsMessage,
    private _dogData: DogData,
    private _cdRef: ChangeDetectorRef,
  ) {}

  public ngOnInit(): void {
    this._fetchData();
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public save = () => {
    return this._dogData.save(this.dog)
      .pipe(
        tap((dog) => {
          this._message.success('Saved Changes');
          this._dialogRef.close(dog);
        }),
      );
  };

  public close(value?): void {
    this._dialogRef.close(value);
  }

  private _fetchData(): void {
    of(this._data.dog)
      .pipe(
        switchMap((dog) => {
          return dog.id
            ? this._dogData.get(this._data.dog.id)
            : of(dog);
        }),
        takeUntil(this._destroy$),
      )
      .subscribe((dog) => {
        this.dog = { ...dog };

        this._cdRef.markForCheck();
      });
  }

}
