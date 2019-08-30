import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';

import { filter, takeUntil, map } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { forEach } from 'lodash-es';

import { FsListComponent, FsListConfig } from '@firestitch/list';
import { RouteObserver } from '@firestitch/core';
import { ItemType } from '@firestitch/filter';
import { nameValue } from '@firestitch/common';

import { NavService, ObjectService, ProjectData, AccountData } from '@app/core';
import { State } from '@app/shared';
import { TimeEntryDialogComponent } from '@libs/timer';
import { TimeEntryData } from '@app/time-entry/data/time-entry.data';
import { TimeEntry } from '@app/time-entry';


@Component({
  templateUrl: './time-entries.component.html',
  styleUrls: ['./time-entries.component.scss']
})
export class TimeEntriesComponent implements OnInit, OnDestroy {

  @ViewChild('list') public list: FsListComponent = null;
  public config: FsListConfig = null;

  public routeObserver = new RouteObserver(this._route, 'project');

  private _destroy$ = new Subject();

  constructor(
    private _timeEntryData: TimeEntryData,
    private _objectService: ObjectService,
    private _ProjectData: ProjectData,
    private _accountData: AccountData,
    private _route: ActivatedRoute,
    private _dialog: MatDialog,
    private _navService: NavService
  ) { }

  public ngOnInit() {

    this._setTitle();

    this._navService.routeChange
      .pipe(
        takeUntil(this._destroy$)
      )
      .subscribe(() => this._setTitle());

    this.config = {
      sort: 'start_date,DESC',
      filters: [
        {
          name: 'keyword',
          type: ItemType.Text,
          label: 'Search'
        },
        {
          name: 'start_date_from',
          type: ItemType.Date,
          label: 'Start Date'
        },
        {
          name: 'start_date_to',
          type: ItemType.Date,
          label: 'End Date'
        },
        {
          name: 'project_id',
          type: ItemType.AutoCompleteChips,
          label: 'Projects',
          values: keyword => {
            return this._ProjectData.gets({ keyword })
              .pipe(map(response => nameValue(response, 'name', 'id')));
          }
        },
        {
          name: 'account_id',
          type: ItemType.AutoCompleteChips,
          label: 'Accounts',
          values: keyword => {
            return this._accountData.gets({ keyword })
              .pipe(map(response => nameValue(response, 'name', 'id')));
          }
        }
      ],
      actions: [
        {
          click: data => {
            this.onUpdate();
          },
          menu: false,
          label: 'Create Entry'
        },
        {
          click: data => {
            // @TODO find better way to get filter query
            const query = this.list.filter['_query'];
            this._timeEntryData.export(query);
          },
          primary: false,
          menu: false,
          label: 'Export'
        },
      ],
      rowActions: [
        {
          click: data => {
            return this._timeEntryData.delete(data);
          },
          show: data => data.state !== State.Deleted,
          remove: {
            title: 'Confirm',
            template: 'Are you sure you would like to delete this entry?',
          },
          menu: true,
          label: 'Delete'
        }
      ],
      fetch: query => {
        Object.assign(query, {
          projects: true,
          tasks: true,
          accounts: true
        });
        return this._timeEntryData.gets(query, { key: null })
          .pipe(
            map(response => {
              forEach(response.time_entries, timeEntry => {
                const meta = this._objectService.objectIdentifier(timeEntry.project, timeEntry.task);
                timeEntry['code'] = `${meta.projectAbr}-${meta.objectAbr}${meta.objectNumber}`;
              });

              return response;
            }),
            map(response => ({ data: response.time_entries, paging: response.paging }))
          );
      },
      restore: {
        query: { state: State.Deleted },
        filterLabel: 'Show Deleted',
        menuLabel: 'Restore',
        click: (row, event) => {
          return this._timeEntryData.put({ id: row.id, state: State.Active })
        },
        // filter: false
      }
    }
  }

  public onUpdate(timeEntry: TimeEntry = { id: null }) {
    const dialogRef = this._dialog.open(TimeEntryDialogComponent, {
      data: { timeEntry }
    });

    dialogRef.afterClosed()
      .pipe(
        filter(response => !!response)
      )
      .subscribe(response => {
        // Always reload list. Server calculating duration
        this.list.list.reload();
        /*
        this.list.list.updateData(
          response,
          (listRow: any) => {
            return listRow.id === response.id;
        }) || this.list.list.reload();
        */
      });
  }

  public onProceedTask(data) {
    this._objectService.navigate(data);
  }

  public ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

  private _setTitle() {
    this._navService.setListTitle('Reports', 'Time Entries');
  }

}
