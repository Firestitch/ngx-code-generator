import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { ImageData } from '@app/core';
import { Object } from '@app/shared/interfaces';


@Component({
  selector: 'app-rich-text',
  templateUrl: './rich-text.component.html',
  styleUrls: ['./rich-text.component.scss']
})
export class RichTextComponent implements OnInit {

  @Input() public content: Object = null;
  @Input() public placeholder: string = null;
  @Output() public changed = new EventEmitter<Object>();

  public options: any = {};

  constructor(
    private _imageData: ImageData
  ) { }

  public ngOnInit() {
    this.options = {
      placeholder: this.placeholder,
      image: {
        upload: (file: Blob) => {
          return this._imageData.image(file);
        }
      },
      modules: {
        toolbar: [
          [{ header: [1, 2, 3, false] }],
          [
            'bold',
            'italic',
            'underline',
            'strike',
            'blockquote'
          ],
          [
            { list: 'ordered' },
            { list: 'bullet' },
            { indent: '-1' },
            { indent: '+1' },
          ],
          [
            { align: [] }
          ],
          [
            'link',
            'image'
          ]
        ]
      }
    }
  }

  onChanged($event) {
    this.changed.emit($event);
  }
}
