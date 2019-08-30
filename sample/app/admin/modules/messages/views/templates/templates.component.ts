import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { takeUntil, map } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { FsListComponent, FsListConfig } from '@firestitch/list';
import { FsMessage } from '@firestitch/message';

import { NavService} from '@app/core';
import { MatDialog } from '@angular/material';
import { MessageData, MessageTemplateData } from '../../data';
import { map as _map } from 'lodash-es';
import { QueueComponent, TemplateComponent } from '../../components';


@Component({
  templateUrl: './templates.component.html'
})
export class TemplatesComponent implements OnInit, OnDestroy {

  @ViewChild('list') public list: FsListComponent = null;
  public config: FsListConfig = null;
  public messageQueueStates = [];

  private _destroy$ = new Subject();

  constructor(
    private _messageTemplateData: MessageTemplateData,
    private _messageData: MessageData,
    private _navService: NavService,
    private _message: FsMessage,
    private _dialog: MatDialog
  ) { }

  public ngOnInit() {

    this.setTitle();

    this.config = {
      actions: [
        {
          label: 'Create Message Template',
          click: () => {
            this.open({});
          }
        }
      ],
      status: false,
      fetch: query => {
      return this._messageTemplateData.gets(query, { key: null })
            .pipe(
              map(response => ({ data: response.message_templates, paging: response.paging }))
            );
      }
    }
  }

  public open(message_template) {
    const dialogRef = this._dialog.open(TemplateComponent, {
      data: { message_template: message_template },
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
    this._navService.setListTitle('Admin', 'Message Templates');
  }
}
