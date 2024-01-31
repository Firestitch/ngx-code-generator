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

import { ProjectsData } from '../../../../../../common/data/projects.data';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ProjectComponent } from '../../components';
import { Subject } from 'rxjs';


@Component({
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsComponent implements OnInit, OnDestroy {

  @ViewChild(FsListComponent)
  public list: FsListComponent;

  public listConfig: FsListConfig;

  private _destroy$ = new Subject<void>();

  constructor(
    private _cdRef: ChangeDetectorRef,
    private _projectsData: ProjectsData,
    private _dialog: MatDialog,
    private _route: ActivatedRoute,
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

  public openDialog(projects: any): void {
    this._dialog.open(ProjectComponent, {
      data: { projects },
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
            return this._projectsData.delete(data);
          },
          remove: {
            title: 'Confirm',
            template: 'Are you sure you would like to delete this record?',
          },
          label: 'Delete',
        },
      ],
      fetch: (query) => {
        return this._projectsData.gets(query, { key: null })
          .pipe(
            map((response: any) => {
              return { data: response.projects, paging: response.paging };
            }),
          );
      },
      restore: {
        query: { state: 'deleted' },
        filterLabel: 'Show Deleted',
        menuLabel: 'Restore',
        reload: true,
        click: (row) => {
          return this._projectsData.put({ id: row.id, state: 'active' });
        },
      },
    };
  }

}

