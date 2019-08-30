import { Component, OnInit, ViewChild } from '@angular/core';

import { chain } from 'lodash-es';

import { FsListConfig, FsListComponent } from '@firestitch/list';
import { map } from 'rxjs/operators';
import { ItemType } from '@firestitch/filter';
import { ApiLogStates } from 'app/system/consts';
import { SystemData } from '@app/system/data';
import { MatDialog } from '@angular/material';
import { ApiLogComponent } from 'app/system/components';


@Component({
  templateUrl: './logs-api.component.html',
  styleUrls: ['./logs-api.component.scss']
})
export class LogsApiComponent implements OnInit {

  @ViewChild('list') list: FsListComponent;
  public config: FsListConfig = null;
  public apiLogStates = [];

  constructor(
    private _systemData: SystemData,
    private _dialog: MatDialog,
  ) { }

  ngOnInit() {

    this.apiLogStates = chain(ApiLogStates)
                      .keyBy('value')
                      .mapValues('name')
                      .value();
    this._configList();
  }

  private _configList() {

    this.config = {
      filters: [
        {
          type: ItemType.Keyword,
          name: 'keyword',
          label: 'Search'
        },
        {
          type: ItemType.Select,
          name: 'state',
          label: 'Status',
          values: ApiLogStates
        },
        {
          name: 'create_date',
          type: ItemType.DateRange,
          label: ['From Date', 'To Date'],
        }
      ],
      fetch: query => {
        Object.assign(query, { });
        return this._systemData.logsApiGets(query, { key: null })
          .pipe(
            map(response => ({ data: response.api_logs, paging: response.paging }))
          );
      }
    };
  }

  public open(api_log) {
    this._dialog.open(ApiLogComponent, {
      data: { api_log: api_log },
      width: '85%'
    });
  }
}
