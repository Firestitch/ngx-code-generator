import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { FsMessage } from '@firestitch/message';
import { MessageData, MessageTemplateData } from '../../data';
import { EmailMessageFormats } from '../../consts';
import { EmailMessageFormat } from '../../enums';
import { FsPrompt } from '@firestitch/prompt';
import { FsStore } from '@firestitch/store';


@Component({
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {

  public message;
  public message_templates = [];
  public emailMessageFormats = EmailMessageFormats;
  public emailMessageFormat = EmailMessageFormat;

  private _account;

  constructor(private _prompt: FsPrompt,
              private _message: FsMessage,
              private _messageData: MessageData,
              private _messageTemplateData: MessageTemplateData,
              private _store: FsStore,
              @Inject(MAT_DIALOG_DATA) public data) {}

  public ngOnInit() {
    this._messageData.get(this.data.message.id)
    .subscribe(response => {
      this.message = response;
    });

    this._messageTemplateData.gets()
    .subscribe(response => {
      this.message_templates = response;
    });

    this._store.observe('account').subscribe((store) => {
      this._account = store.value;
    });
  }

  public save() {
    this._messageData.save(this.message)
    .subscribe(message => {
      this._message.success('Saved Changes');
    });
  }


  public sendTest() {
    this._prompt.input({
      label: 'Please an email to send test to',
      title: 'Send Test',
      commitLabel: 'Send',
      default: this._account.email,
      required: true
    }).subscribe((value: string) => {
      this._messageData.sendTest(this.message, { email: value })
      .subscribe(message => {
        this._message.success('Test Sent');
      });
    });
  }
}
