import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material';

import { Observable } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { chain } from 'lodash-es';

import { FsListComponent, FsListConfig } from '@firestitch/list';
import { RouteObserver } from '@firestitch/core';
import { nameValue } from '@firestitch/common';
import { ItemType } from '@firestitch/filter';

import { EnvironmentData } from '@app/core';

import { SessionData } from '../../data';
import { differenceInSeconds, parseISO } from 'date-fns';
import { SessionStates } from '../../consts/session-states.const';
import { SessionState } from '../../enums/session-state.enum';


@Component({
  templateUrl: './sessions.component.html'
})
export class SessionsComponent implements OnInit {


  @ViewChild('table') public table: FsListComponent = null;
  public config: FsListConfig = null;
  public sessionStates = [];
  public sessionState = SessionState;
  public differenceInSeconds = differenceInSeconds;
  public routeObserver = new RouteObserver(this._route, 'project');

  constructor(
    private _route: ActivatedRoute,
    private _sessionData: SessionData,
    private _environmentData: EnvironmentData,
    private _dialog: MatDialog,
  ) { }

  public ngOnInit() {

    this.sessionStates = chain(SessionStates)
                                .keyBy('value')
                                .mapValues('name')
                                .value();

    this.config = {
      sort: 'expiry_date,desc',
      filters: [
        {
          name: 'keyword',
          type: ItemType.Keyword,
          label: 'Search'
        },
        {
          name: 'environment_id',
          type: ItemType.Select,
          label: 'Workspaces',
          multiple: true,
          values: () => {
            return this._environmentData.gets()
            .pipe(
              map(response => nameValue(response, 'name', 'id'))
            );
          },
        },
        {
          name: 'state',
          type: ItemType.Select,
          label: 'Status',
          default: SessionState.Active,
          values: SessionStates
        }
      ],
      rowActions: [
        {
          click: data => {
            return this._sessionData.delete(data);
          },
          show: data => data.state !== SessionState.Deleted,
          remove: {
            title: 'Confirm',
            template: 'Are you sure you would like to delete this session?',
          },
          menu: true,
          label: 'Delete'
        }
      ],
      fetch: query => {
        query.accounts = true;
        query.environments = true;
        return this._sessionData.gets(query, { key: null })
          .pipe(
            map(response => ({ data: response.sessions.map((session) => {
              session.is_expired = parseISO(session.expiry_date) > new Date();
              return session;
            }), paging: response.paging }))
          );
      }
    }
  }
}
