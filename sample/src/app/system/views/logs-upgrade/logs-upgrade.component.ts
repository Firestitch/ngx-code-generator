import { Component, OnInit, ViewChild } from '@angular/core';


import { FsListConfig, FsListComponent } from '@firestitch/list';
import { map } from 'rxjs/operators';
import { ItemType } from '@firestitch/filter';
import { SystemData } from '@app/system/data';
import { MatDialog } from '@angular/material';


@Component({
  templateUrl: './logs-upgrade.component.html',
  styleUrls: ['./logs-upgrade.component.scss']
})
export class LogsUpgradeComponent implements OnInit {

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
      paging: false,
      filters: [
        {
          type: ItemType.Keyword,
          name: 'keyword',
          label: 'Search'
        }
      ],
      fetch: query => {
        Object.assign(query, { });
        return this._systemData.logsUpgradeGets(query, { key: null })
          .pipe(
            map(response => ({ data: response.upgrades }))
          );
      }
    };
  }
}
