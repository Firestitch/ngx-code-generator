import {Component, Inject} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { FsMessage } from '@firestitch/message';

import { ContentData, ImageData } from '@app/core';


@Component({
  templateUrl: 'content.component.html',
  styleUrls: ['content.component.scss']
})
export class ContentComponent {

  public content_widget: any = {};
  public options = {
    image: {
      upload: (file: Blob) => {
        return this._imageData.image(file)
      }
    },
    change: () => {}
  };

  public constructor( private _dialogRef: MatDialogRef<ContentComponent>,
                      private _contentData: ContentData,
                      private _message: FsMessage,
                      private _imageData: ImageData,
                      @Inject(MAT_DIALOG_DATA) private data) {
    this.content_widget = Object.assign({}, data.content_widget);
  }

  public save() {
    this._contentData.save(this.content_widget)
      .subscribe(content_widget => {
        Object.assign(this.data.content_widget, content_widget);
        this._dialogRef.close();
        this._message.success('Saved Changes');
      });
  }
}
