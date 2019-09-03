import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { FsProgressService } from '@firestitch/progress';
import { FsMessage } from '@firestitch/message';

import { ModuleInterface } from '../../../interfaces/';
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
  public model = {
    modulePath: null,
    name: null,
    routing: true
  };

  constructor(
    public dialogRef: MatDialogRef<CreateModuleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { rootModule: ModuleInterface },
    private _generatorService: ModulesService,
    private _progressService: FsProgressService,
    private _message: FsMessage,
  ) {
  }

  public ngOnInit() {
    // this.model.module = this.data.rootModule;
  }

  public generate() {
    const progressDialog = this._progressService.open();

    this._generatorService.generateModule(this.model)
      .subscribe((response: any) => {
        progressDialog.close();
        this._message.success('Successfully Generated');
        this.dialogRef.close(response);
      }, (response) => {
        progressDialog.close();
        this._message.error(response.error && response.error.message || (response.body && response.body.error) || response.message);
      }
    );
  }

}
