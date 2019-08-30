import { Component, OnInit, Inject } from '@angular/core';
import { NavService } from '@app/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FsMessage } from '@firestitch/message';
import { MessageTemplateData } from '../../data';


@Component({
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.scss']
})
export class TemplateComponent implements OnInit {

  public message_template;

  constructor(private _messageTemplateData: MessageTemplateData,
              private _dialogRef: MatDialogRef<TemplateComponent>,
              @Inject(MAT_DIALOG_DATA) public data) {}

  public ngOnInit() {

    if (this.data.message_template.id) {
      this._messageTemplateData.get(this.data.message_template.id)
      .subscribe(message_template => {
        this.message_template = message_template;
      });
    } else {
      this.message_template = {};
    }
  }

  public save() {
    this._messageTemplateData.save(this.message_template)
    .subscribe(message_template => {
      this._dialogRef.close(message_template);
    });
  }
}
