import { MAT_DIALOG_DATA } from '@angular/material';
import { Inject, Component } from '@angular/core';

@Component({
  templateUrl: 'content-widget-dialog.component.html',
  styleUrls: ['content-widget-dialog.component.scss']
})
export class ContentWidgetDialogComponent {

  public title;
  public tag;

  public constructor(@Inject(MAT_DIALOG_DATA) private data) {
    this.title = data.title;
    this.tag = data.tag;
  }
}
