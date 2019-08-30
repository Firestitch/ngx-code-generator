import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { NgForm } from '@angular/forms';

import { FsMessage } from '@firestitch/message';

import { TypeData, DocData } from '@app/core';
import { Type } from '@app/shared/interfaces';
import { Doc } from '@libs/drawers/doc-drawer/interfaces';


@Component({
  selector: 'app-doc-create',
  templateUrl: './doc-create.component.html',
  styleUrls: ['./doc-create.component.scss']
})
export class DocCreateComponent implements OnInit {

  public doc: Doc = { id: null };
  public types: Type[] = [];
  public selectedType: Type = null;
  public isTypeSelected = false;

  @ViewChild('form') public form: NgForm;

  constructor(
    private _dialogRef: MatDialogRef<DocCreateComponent>,
    private _message: FsMessage,
    private _docData: DocData,
    private _typeData: TypeData,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    this.doc.project_id = data.project_id;
    this._typeData.gets({ class: 'doc' })
    .subscribe(resp => {
      this.types = resp;
    });
  }

  public ngOnInit() {}

  public onTypeSelected() {

    this.doc.type = this.selectedType;
    this.doc.type_id = this.selectedType.id;

    if (!this.doc.name) {

      this._docData.getParsedName({ project_id: this.doc.project_id, type_id: this.doc.type_id })
        .subscribe(response => {
          this.doc.name = response;
          this.isTypeSelected = true;
        });
    }
  }

  public save() {
    this._docData.save(this.doc).subscribe(response => {
      this._message.success('Doc created');
      this.close(response);
    });
  }

  public close(data = null) {
    this._dialogRef.close(data);
  }

}
