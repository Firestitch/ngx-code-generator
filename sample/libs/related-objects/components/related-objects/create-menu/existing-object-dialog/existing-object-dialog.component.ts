import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { filter } from '@firestitch/common';

import { ObjectData } from '@app/core';
import { Object } from '@app/shared/interfaces';


@Component({
  selector: 'app-relate-existing-object-dialog',
  templateUrl: './existing-object-dialog.component.html',
})
export class RelateExistedObjectDialogComponent implements OnInit {

  public entity: Object = null;
  public relates = [];

  constructor(
    private _objectData: ObjectData,
    @Inject(MAT_DIALOG_DATA) public data,
    private _dialogRef: MatDialogRef<RelateExistedObjectDialogComponent>,
  ) { }

  public ngOnInit() {
    this.entity = this.data.entity;
    this.relates = this.data.relates;
  }

  public close() {
    this._dialogRef.close(this.relates);
  }

  public relate(entity: { checked: boolean, record: Object }) {
    if (entity.checked) {
      this.addRelation(entity.record);
    } else {
      this.removeRelation(entity.record);
    }
  }

  public removeRelation(entity: Object) {
    this._objectData.removeRelative(this.data.entity.id, entity.id)
      .subscribe((response) => {
        const parentArray = this.relates[entity.class] ? this.relates[entity.class] : [];
        const index = parentArray.findIndex((object) => {
          return object.id === entity.id
        });

        if (index !== -1) {
          this.relates[entity.class].splice(index, 1);
        }
      });
  }

  public addRelation(entity: Object) {
    this._objectData.relate(this.data.entity.id, entity.id)
      .subscribe((response) => {

        if (!this.relates[entity.class]) {
          this.relates[entity.class] = [];
        }

        this.relates[entity.class].push(entity);
      });
  }

  public onHighlightSwitch($event) {

    for (const key in this.relates) {
      if (!this.relates[key]) {
        continue;
      }
      const data = filter(this.relates[key], { id: $event.related_object_id });

      if (data.length) {
        data[0].related_object_highlight = $event.action === 'highlight' ? 1 : 0;
      }
    }
  }
}
