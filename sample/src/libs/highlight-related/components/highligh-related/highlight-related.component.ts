import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';

import { ObjectService, ObjectData } from '@app/core';
import { Object } from '@app/shared/interfaces';


@Component({
  selector: 'app-highlight-related',
  templateUrl: './highlight-related.component.html',
  styleUrls: ['./highlight-related.component.scss']
})
export class HighlightRelatedComponent implements OnInit {

  @Input() public object: Object = null;
  @Input() public relatedObject: Object = null;

  @Output() public highlightSwitch = new EventEmitter<any>();

  constructor(private _objectService: ObjectService,
              private _objectData: ObjectData) { }

  public ngOnInit() {
  }

  public switch() {
    const result: any = {
      object_id: this.object.id,
      related_object_id: this.relatedObject.id,
      object: this.object,
      related_object: this.relatedObject
    };
    if (this.relatedObject.related_object_highlight) {
      this.unhighlight().subscribe(() => {
        result.action = 'unhighlight';
        this.highlightSwitch.emit(result);
      });
    } else {
      this.highlight().subscribe(() => {
        result.action = 'highlight';
        this.highlightSwitch.emit(result);
      });
    }
  }

  private highlight() {
    return this._objectData.highlight(this.object.id, { object_id: this.relatedObject.id });
  }

  private unhighlight() {
    return this._objectData.unhighlight(this.object.id, { object_id: this.relatedObject.id });
  }

}
