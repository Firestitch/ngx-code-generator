import { Component, Input, Output, EventEmitter, OnInit, ViewChild } from '@angular/core';

import { map } from 'rxjs/operators';

import { FsListComponent, FsListConfig, ReorderPosition, ReorderStrategy } from '@firestitch/list';
import { list } from '@firestitch/common';
import { ItemType } from '@firestitch/filter';

import { StatusData } from '@app/core';
import { Status } from '@app/shared';
import { State } from '@app/shared';


@Component({
  selector: 'app-statuses-list',
  templateUrl: './statuses-list.component.html',
  styleUrls: ['./statuses-list.component.scss']
})
export class StatusesListComponent implements OnInit {

  @Input() public class = 'task';

  @Output() public update = new EventEmitter<Status>();

  @ViewChild('list')
  public list: FsListComponent = null;

  public config: FsListConfig = null;

  constructor(
    private _statusData: StatusData,
  ) { }

  public ngOnInit() {

    this.config = {
      filters: [
        {
          name: 'keyword',
          type: ItemType.Keyword,
          label: 'Search'
        }
      ],
      actions: [
        {
          label: 'Create Status',
          click: (event) => {
            this.onUpdate();
          }
        }
      ],
      rowActions: [
        {
          click: data => {
            return this._statusData.delete(data);
          },
          remove: {
            title: 'Confirm',
            template: 'Are you sure you would like to delete this status?',
          },
          menu: true,
          label: 'Delete'
        },
        {
          click: data => {
            return this._statusData.setDefault(data.id).subscribe(response => {
              this.list.reload();
            });
          },
          show: (row) => !row.default,
          menu: true,
          label: 'Set As Default'
        },
      ],
      reorder: {
        position: ReorderPosition.Left,
        strategy: ReorderStrategy.Always,
        done: (data) => {
          this.saveOrder(data);
        }
      },
      fetch: query => {
        Object.assign(query, { class: this.class });
        return this._statusData.gets(query, { key: null })
          .pipe(
            map(response => ({ data: response.statuses, paging: response.paging }))
          );
      },
      restore: {
        query: {state: State.Deleted},
        filterLabel: 'Show Deleted',
        menuLabel: 'Restore',
        filter: true,
        click: (row) => {
          return this._statusData.put({id: row.id, state: State.Active})
        }
      }
    };
  }

  public onUpdate(status: Status = { id: null, class: this.class }) {
    this.update.emit(status);
  }

  private saveOrder(data) {
    this._statusData.order({
      status_ids: list(data, 'id'),
      limit: data.length,
      page: this.list.list.paging.page
    })
    .subscribe(() => {
      this.list.reload();
    });
  }
}
