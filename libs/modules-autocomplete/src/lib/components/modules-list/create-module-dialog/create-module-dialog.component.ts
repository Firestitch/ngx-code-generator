import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { FsProgressService } from '@firestitch/progress';
import { FsMessage } from '@firestitch/message';

import { ModulesService } from '../../../services/modules.service';


@Component({
  selector: 'app-create-module-dialog',
  templateUrl: './create-module-dialog.component.html',
  styleUrls: ['./create-module-dialog.component.scss'],
  providers: [
    ModulesService,
  ]
})

export class CreateModuleDialogComponent implements OnInit {
  public model: any = {
    modulePath: '/',
    name: null,
    routing: true,
    project: ''
  };

  constructor(
    public dialogRef: MatDialogRef<CreateModuleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { project: string },
    private _generatorService: ModulesService,
    private _progressService: FsProgressService,
    private _message: FsMessage,
  ) {
  }

  public ngOnInit() {
    this.model.project = this.data.project;
  }

  public generate() {
    // const progressDialog = this._progressService.open();

    this._generatorService.generateModule(this.model)
      .subscribe((response: any) => {
        // progressDialog.close();
        this._message.success('Successfully Generated');
        this.dialogRef.close(response);
      }, (response) => {
        // progressDialog.close();
        this._message.error(response.error && response.error.message || (response.body && response.body.error) || response.message);
      }
    );
  }

}
