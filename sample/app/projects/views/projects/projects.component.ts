import { Component, EventEmitter, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { FsListComponent, FsListConfig } from '@firestitch/list';
import { nameValue } from '@firestitch/common';
import { ItemType } from '@firestitch/filter';

import { of } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';

import { ProjectData, StatusData, SessionService } from '@app/core';
import { NavService } from '@app/core';
import { State } from '@app/shared';


@Component({
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit, OnDestroy {

  @ViewChild('ProjectsList')
  public list: FsListComponent = null;
  public config: FsListConfig = null;

  private _destroy$ = new EventEmitter();

  constructor(
    private _projectData: ProjectData,
    private _statusData: StatusData,
    private _navService: NavService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _sessionService: SessionService
  ) { }

  public ngOnInit() {

    this._navService.routeChange
      .pipe(takeUntil(this._destroy$))
      .subscribe(() => this.setTitle());

    this.setTitle();

    this.config = {
      sort: 'name,asc',
      filters: [
        {
          name: 'keyword',
          type: ItemType.Text,
          label: 'Search'
        },
        {
          name: 'status_id',
          type: ItemType.Select,
          multiple: true,
          model: [],
          label: 'Status',
          values: () => {
            return this._statusData.gets({ class: 'project' })
            .pipe(
              map(response => nameValue(response, 'name', 'id'))
            );
          }
        },
      ],
      actions: [
        {
          label: 'Create Project',
          click: event => {
            this._router.navigate(['../projects/create'], { relativeTo: this._route });
          }
        }
      ],
      rowActions: [
        {
          click: data => {
            return this._projectData.delete(data);
          },
          remove: {
            title: 'Confirm',
            template: 'Are you sure you would like to delete this record?',
          },
          menu: true,
          label: 'Delete'
        }
      ],
      fetch: query => {
        query.statuses = true;

        if (this._sessionService.environment()) {
          query.workspace_id = this._sessionService.environment().id;
        } else {
          return of({ data: [] });
        }

        return this._projectData.gets(query, { key: null })
          .pipe(
            map(response => ({ data: response.projects, paging: response.paging }))
          );
      },
      restore: {
        query: { state: State.Deleted },
        filterLabel: 'Show Deleted',
        filter: true,
        menuLabel: 'Restore',
        click: (row, event) => {
          return this._projectData.put({id: row.id, state: State.Active})
        }
      }
    };
  }

  public ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

  private setTitle() {
    this._navService.setListTitle(null, 'Projects');
  }

}
