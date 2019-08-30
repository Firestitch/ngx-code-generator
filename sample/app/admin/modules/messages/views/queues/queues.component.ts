import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { takeUntil, map } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { FsListComponent, FsListConfig } from '@firestitch/list';
import { chain } from 'lodash-es';
import { ItemType } from '@firestitch/filter';
import { FsMessage } from '@firestitch/message';

import { NavService} from '@app/core';
import { MatDialog } from '@angular/material';
import { MessageData, MessageQueueData } from '../../data';
import { map as _map } from 'lodash-es';
import { QueueComponent } from '../../components';
import { MessageQueueStates } from '../../consts';
import { MessageQueueState } from '../../enums/message-queue-state.enum';


@Component({
  templateUrl: './queues.component.html'
})
export class QueuesComponent implements OnInit, OnDestroy {

  @ViewChild('list') public list: FsListComponent = null;
  public config: FsListConfig = null;
  public messageQueueStates = [];

  private _destroy$ = new Subject();

  constructor(
    private _messageQueueData: MessageQueueData,
    private _messageData: MessageData,
    private _navService: NavService,
    private _message: FsMessage,
    private _dialog: MatDialog
  ) { }

  public ngOnInit() {

    this.messageQueueStates = chain(MessageQueueStates)
                                .keyBy('value')
                                .mapValues('name')
                                .value();
    this.setTitle();

    this.config = {
      filters: [
        {
          name: 'keyword',
          type: ItemType.Keyword,
          label: 'Search'
        },
        {
          name: 'state',
          type: ItemType.Select,
          label: 'Status',
          default: MessageQueueState.Sent,
          values: () => {
            return MessageQueueStates;
          }
        },
        {
          name: 'date',
          type: ItemType.DateRange,
          label: ['From Date', 'To Date'],
        },
        {
          name: 'message_id',
          type: ItemType.Select,
          label: 'Message Type',
          values: () => {
            return this._messageData.gets()
            .pipe(
              map(items => {
                return _map( items, (item) => ( { name: item.name, value: item.id }) )
              })
            )
          }
        }
        // {
        //   name: 'date',
        //   type: ItemType.DateRange,
        //   label: 'Date'
        // },
      ],
      sort: 'created_date,desc',
      fetch: query => {
        return this._messageQueueData.gets(query, { key: null })
          .pipe(
            map(response => ({ data: response.message_queues, paging: response.paging }))
          );
      }
    }
  }

  public open(message_queue) {
    const dialogRef = this._dialog.open(QueueComponent, {
      data: { message_queue: message_queue },
      width: '85%'
    });

    dialogRef.afterClosed()
    .pipe(
      takeUntil(this._destroy$)
    )
    .subscribe((response) => {
      if (response) {
        this.list.updateData(
          response,
          (row: any) => {
            return row.id === response.id;
          });
      }
    })
  }


  public ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

  private setTitle() {
    this._navService.setListTitle('Admin', 'Message Queue');
  }
}
