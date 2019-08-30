import { Component, OnInit, ViewChild } from '@angular/core';

import { chain } from 'lodash-es';

import { FsListConfig, FsListComponent } from '@firestitch/list';
import { map } from 'rxjs/operators';
import { ItemType } from '@firestitch/filter';
import { ProcessStates } from 'app/system/consts';
import { SystemData } from '@app/system/data';
import { MatDialog } from '@angular/material';
import { ApiLogComponent } from 'app/system/components';
import { NavService } from 'app/core';


@Component({
  templateUrl: './processes.component.html',
  styleUrls: ['./processes.component.scss']
})
export class ProcessesComponent implements OnInit {

  @ViewChild('list') list: FsListComponent;
  public config: FsListConfig = null;
  public processStates = [];

  constructor(
    private _systemData: SystemData,
    private _dialog: MatDialog,
    private _navService: NavService
  ) { }

  ngOnInit() {

    this.processStates = chain(ProcessStates)
                      .keyBy('value')
                      .mapValues('name')
                      .value();
    this._configList();
    this._setTitle();
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
          values: ProcessStates
        },
        // {
        //   name: 'create_date',
        //   type: ItemType.DateRange,
        //   label: ['From Date', 'To Date'],
        // }
      ],
      fetch: query => {
        Object.assign(query, { });
        return this._systemData.processesGets(query, { key: null })
          .pipe(
            map(response => ({ data: response.processes, paging: response.paging }))
          );
      }
    };
  }

  private _setTitle() {
    this._navService.setListTitle('System', 'Processes');
  }

  public open(api_log) {
    this._dialog.open(ApiLogComponent, {
      data: { api_log: api_log },
      width: '85%'
    });
  }
}
