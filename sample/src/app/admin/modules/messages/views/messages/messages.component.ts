import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { takeUntil, map } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { FsListComponent, FsListConfig } from '@firestitch/list';
import { chain } from 'lodash-es';
import { ItemType } from '@firestitch/filter';
import { FsMessage } from '@firestitch/message';

import { NavService} from '@app/core';
import { MatDialog } from '@angular/material';
import { MessageComponent } from '../../components/message';
import { MessageData } from '../../data';
import { EmailMessageFormats } from '../../consts';


@Component({
  templateUrl: './messages.component.html'
})
export class MessagesComponent implements OnInit, OnDestroy {

  @ViewChild('list') public list: FsListComponent = null;
  public config: FsListConfig = null;
  public emailMessageFormats = [];

  private _destroy$ = new Subject();

  constructor(
    private _messageData: MessageData,
    private _navService: NavService,
    private _message: FsMessage,
    private _dialog: MatDialog
  ) { }

  public ngOnInit() {


    this.emailMessageFormats = chain(EmailMessageFormats)
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
        }
      ],

      fetch: query => {
        return this._messageData.gets(query, { key: null })
          .pipe(
            map(response => ({ data: response.messages, paging: response.paging }))
          );
      }
    }
  }

  public open(message) {
    const dialogRef = this._dialog.open(MessageComponent, {
      data: { message: message},
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
    this._navService.setListTitle('Admin', 'Messages');
  }
}
