import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { NavService } from '@app/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import { FsMessage } from '@firestitch/message';
import { MessageQueueData } from '../../data';
import { MessageComponent } from '../message';
import { EmailMessageQueueFormat } from '../../enums';
import { MessageQueueStates } from '../../consts';
import { chain } from 'lodash-es';
import { FsPrompt } from '@firestitch/prompt';
import { FsListConfig } from '@firestitch/list';
import { map } from 'rxjs/operators';


@Component({
  templateUrl: './queue.component.html',
  styleUrls: ['./queue.component.scss']
})
export class QueueComponent implements OnInit {

  @ViewChild('bodyFrame') bodyFrame: ElementRef;

  public message_queue;
  public emailMessageQueueFormat = EmailMessageQueueFormat;
  public bodyFrameHeight;
  public messageQueueStates;
  public logConfig: FsListConfig;

  constructor(private _message: FsMessage,
              private _messageQueueData: MessageQueueData,
              private _prompt: FsPrompt,
              private _dialog: MatDialog,
              @Inject(MAT_DIALOG_DATA) public data) {}

  public ngOnInit() {

    this.messageQueueStates = chain(MessageQueueStates)
                                .keyBy('value')
                                .mapValues('name')
                                .value();

    this._messageQueueData.get(this.data.message_queue.id, { messages: true })
    .subscribe(message_queue => {
      this.message_queue = message_queue;
      this._setBodyContent(message_queue);
      this._setLogsConfig(message_queue);
    });
  }

  public openMessage(message) {
    const dialogRef = this._dialog.open(MessageComponent, {
      data: { message: message },
      width: '85%'
    });
  }

  public resend() {
    this._prompt.confirm({
      title: 'Confirm',
      template: 'Are you sure you would like to resend this message?'
    }).subscribe(() => {
      this._messageQueueData.resend(this.data.message_queue)
      .subscribe(message_queue => {
        this._message.success('Successfully resent');
      });
    });
  }

  public forward() {
    this._prompt.input({
      label: 'Please an email to forward to',
      title: 'Forward Message',
      commitLabel: 'Forward',
      required: true
    }).subscribe((value: string) => {
      this._messageQueueData.forward(this.data.message_queue, value)
      .subscribe(message_queue => {
        this._message.success('Successfully forwarded');
      });
    });
  }

  public selectedTabChange(event) {
    if (event.index === 0) {
      this._setBodyContent(this.message_queue);
    }
  }

  private _setBodyContent(message_queue) {
    setTimeout(() => {
      const win: Window = this.bodyFrame.nativeElement.contentWindow;
      const doc: Document = win.document;
      const data = `<style>
                      body {
                        font-family: Roboto;
                        font-size: 15px;
                        margin: 0;
                      }

                      a {
                        color: #1155CC;
                      }
                      </style>` + message_queue.email_message_queue.body;
      doc.open();
      doc.write(data);
      doc.close();

      this.bodyFrameHeight = doc.body.offsetHeight;
    });
  }

  private _setLogsConfig(message_queue) {
    this.logConfig = {
      fetch: query => {
        return this._messageQueueData.logsGets(message_queue, { key: null })
          .pipe(
            map(response => ({ data: response.message_logs, paging: response.paging }))
          );
      }
    }
  }
}
