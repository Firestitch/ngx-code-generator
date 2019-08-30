import { Component, Input, OnInit } from '@angular/core';

import { filter, list } from '@firestitch/common';

import { ObjectService } from '@app/core';
import { Object } from '@app/shared/interfaces';
import { ObjectClasses } from '@app/shared/consts';


@Component({
  selector: 'app-highlighted-related-view',
  templateUrl: './highlighted-related-view.component.html',
  styleUrls: ['./highlighted-related-view.component.scss']
})
export class HighlightedRelatedViewComponent implements OnInit {

  public icons: any = {};

  private _objects: Object[] = [];

  @Input() public set objects(data: Object[]) {
    this._objects = data;
    this.highlightedObjects = filter(this._objects, { related_object_highlight: 1 });
  }

  public get objects(): Object[] {
    return this._objects;
  }

  public highlightedObjects: Object[] = [];

  constructor() { }

  public ngOnInit() {
    this.icons = list(ObjectClasses, 'icon', 'value');
  }

}
