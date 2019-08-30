import { Component, OnInit, ViewChild } from '@angular/core';

import { FsMessage } from '@firestitch/message';
import { chain } from 'lodash-es';

import { NavService } from 'app/core';
import { FsListConfig, FsListComponent } from '@firestitch/list';
import { map } from 'rxjs/operators';
import { ItemType } from '@firestitch/filter';
import { CronData } from '@app/system/data/cron.data';
import { CronStates } from 'app/system/consts';


@Component({
  templateUrl: './crons.component.html',
  styleUrls: ['./crons.component.scss']
})
export class CronsComponent implements OnInit {

  @ViewChild('list') list: FsListComponent;
  public config: FsListConfig = null;
  public cronStates = [];

  constructor(
    private _cronData: CronData,
    private _message: FsMessage,
    private _navService: NavService,
  ) { }

  ngOnInit() {

    this.cronStates = chain(CronStates)
                      .keyBy('value')
                      .mapValues('name')
                      .value();

    this._setTitle();
    this._configList();
  }

  private _setTitle() {
    this._navService.setListTitle('System', 'Crons');
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
      rowActions: [
        {
          click: data => {
            return this._cronData.enable(data)
            .subscribe(() => {
              this._message.success('Enabled cron');
              this.list.reload();
            })
          },
          label: 'Enable'
        },
        {
          click: data => {
            return this._cronData.disable(data)
            .subscribe(() => {
              this._message.success('Disabled cron');
              this.list.reload();
            })
          },
          label: 'Disable'
        },
        {
          click: data => {
            return this._cronData.kill(data)
            .subscribe(() => {
              this._message.success('Killed cron');
              this.list.reload();
            })
          },
          label: 'Kill'
        },
        {
          click: data => {
            return this._cronData.queue(data)
            .subscribe(() => {
              this._message.success('Queued cron');
              this.list.reload();
            })
          },
          label: 'Queue'
        },
        {
          click: data => {
            return this._cronData.run(data)
            .subscribe((response) => {
              this._message.success('Cron ran');
              this.list.reload();
            })
          },
          label: 'Run'
        }
      ],
      fetch: query => {
        Object.assign(query, { });
        return this._cronData.gets(query, { key: null })
          .pipe(
            map(response => ({ data: response.crons, paging: response.paging }))
          );
      }
    };
  }

}
