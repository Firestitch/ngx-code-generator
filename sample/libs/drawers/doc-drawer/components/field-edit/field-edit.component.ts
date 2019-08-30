import {Component, Inject} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { FS_FIELD_EDITOR_CONFIG } from '@firestitch/field-editor';

import { FieldData } from '@app/core';
import { Type } from '@app/shared/interfaces';
import { Doc } from '@libs/drawers/doc-drawer/interfaces'


@Component({
  templateUrl: './field-edit.component.html',
  styleUrls: ['./field-edit.component.scss']
})
export class FieldEditComponent {

  public entity: Doc | Type = null;

  public config: any = {fields: []};

  public constructor(
    private _dialogRef: MatDialogRef<FieldEditComponent>,
    private _fieldData: FieldData,
    @Inject(MAT_DIALOG_DATA) private data,
    @Inject(FS_FIELD_EDITOR_CONFIG) private defaultConfig,
  ) {
    this.entity = data.entity;

    this.config = {
      fields: data.fields,
      toolbar: {items: this.defaultConfig.toolbar.items}
    };
  }

  public submitFormData() {
    this._fieldData.updateConfig(this.entity.id, { fields: this.config.fields })
      .subscribe(response => {
        this._dialogRef.close(response);
      });
  }

  public close(data = null) {
    this._dialogRef.close(data);
  }

}
