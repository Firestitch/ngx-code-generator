import { Component, OnInit, ViewChild } from '@angular/core';

import { FsListConfig, FsListComponent } from '@firestitch/list';
import { map } from 'rxjs/operators';
import { ItemType } from '@firestitch/filter';
import { SystemData } from '@app/system/data';
import { MatDialog } from '@angular/material';
import { LogComponent } from 'app/system/components';


@Component({
  templateUrl: './logs-server.component.html',
  styleUrls: ['./logs-server.component.scss']
})
export class LogsServerComponent implements OnInit {

  @ViewChild('list') list: FsListComponent;
  public config: FsListConfig = null;
  public logTypes = [];

  constructor(
    private _systemData: SystemData,
    private _dialog: MatDialog
  ) { }

  ngOnInit() {

    // this.logTypes = chain(CronStates)
    //                   .keyBy('value')
    //                   .mapValues('name')
    //                   .value();

    this._configList();
  }
  private _configList() {

    this.config = {
      filters: [
        {
          type: ItemType.Keyword,
          name: 'keyword',
          label: 'Search'
        }
      ],
      fetch: query => {
        Object.assign(query, { });
        return this._systemData.logsServerGets(query, { key: null })
          .pipe(
            map(response => ({ data: response.logs, paging: response.paging }))
          );
      }
    };
  }

  public open(log) {
    const dialogRef = this._dialog.open(LogComponent, {
      data: { log: log },
      width: '85%'
    });
  }

}
