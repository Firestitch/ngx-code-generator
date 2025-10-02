import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectionStrategy,
  ChangeDetectorRef, OnDestroy
} from '@angular/core';

import { FsListComponent, FsListConfig } from '@firestitch/list';
import { ItemType } from '@firestitch/filter';

import { map, takeUntil, filter } from 'rxjs/operators';

import { DogData } from '../../../../../../common/data/dog.data';
import { MatDialog } from '@angular/material/dialog';
import { DogComponent } from '../../components';
import { Subject } from 'rxjs';


@Component({
  templateUrl: './dogs.component.html',
  styleUrls: ['./dogs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DogsComponent implements OnInit, OnDestroy {

  @ViewChild(FsListComponent)
  public list: FsListComponent;

  public listConfig: FsListConfig;

  private _destroy$ = new Subject<void>();

  constructor(
    private _dogData: DogData,
    private _dialog: MatDialog,
  ) {}

  public ngOnInit(): void {
    this._initListConfig();
  }
  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }


  public reload(): void {
    this.list.reload();
  }

  public openDialog(dog: any): void {
    this._dialog.open(DogComponent, {
      data: { dog },
    })
      .afterClosed()
      .pipe(
        filter((response) => !!response),
        takeUntil(this._destroy$),
      )
      .subscribe(() => this.reload());
  }


  private _initListConfig(): void {
    this.listConfig = {
      filters: [
        {
          name: 'keyword',
          type: ItemType.Keyword,
          label: 'Search',
        },
      ],
      actions: [
        {
          label: 'Create',
          click: () => {
            this.openDialog({});
          },
        },
      ],
      rowActions: [
        {
          click: (data) => {
            return this._dogData.delete(data);
          },
          remove: {
            title: 'Confirm',
            template: 'Are you sure you would like to delete this record?',
          },
          label: 'Delete',
        },
      ],
      fetch: (query) => {
        return this._dogData.gets(query, { key: null })
          .pipe(
            map((response: any) => {
              return { data: response.dogs, paging: response.paging };
            }),
          );
      },
      restore: {
        query: { state: 'deleted' },
        filterLabel: 'Show Deleted',
        menuLabel: 'Restore',
        reload: true,
        click: (row) => {
          return this._dogData.put({ id: row.id, state: 'active' });
        },
      },
    };
  }

}

