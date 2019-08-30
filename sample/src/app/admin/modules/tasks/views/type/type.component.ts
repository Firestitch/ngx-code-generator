import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';

import { FsMessage } from '@firestitch/message';

import { TypeData, WorkflowData } from '@app/core';
import { Type, Workflow } from '@app/shared';


@Component({
  templateUrl: './type.component.html',
  styleUrls: ['./type.component.scss']
})
export class TypeComponent implements OnInit {

  public type: Type = null;

  public workflow: Workflow = null;
  public workflow_id: number = null;

  public workflows: Workflow[] = [];

  constructor(
    private _dialogRef: MatDialogRef<TypeComponent>,
    private _router: Router,
    private _message: FsMessage,
    private _typeData: TypeData,
    private _workflowData: WorkflowData,
    @Inject(MAT_DIALOG_DATA) public data
  ) { }

  public ngOnInit() {
    this.type = Object.assign({}, this._typeData.create(this.data.type));

    if (this.type.workflow_id) {
      this.workflow_id = this.type.workflow_id;
    }

    this._workflowData.gets({ class: 'general' })
        .subscribe(response => this.workflows = response);
  }

  public save() {
    this._typeData.save(Object.assign({}, this.type, { workflow_id: this.workflow_id }))
      .subscribe(response => {
        this._message.success('Saved Changes');
        this.close(response);
      });
  }

  public close(data = null) {
    this._dialogRef.close(data);
  }
}
