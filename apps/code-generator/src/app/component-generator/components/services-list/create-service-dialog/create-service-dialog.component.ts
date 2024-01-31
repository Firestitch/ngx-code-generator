import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ModuleInterface } from '@codegenerator/modules-autocomplete';
import { FsProgressService } from '@firestitch/progress';
import { FsMessage } from '@firestitch/message';
import { kebabCase } from 'lodash-es';

import * as pluralize from 'pluralize';
import { ServicesService } from '../../../services';
import { camelize } from '@angular-devkit/core/src/utils/strings';

@Component({
  selector: 'app-create-service-dialog',
  templateUrl: './create-service-dialog.component.html',
  styleUrls: ['./create-service-dialog.component.scss'],
})
export class CreateServiceDialogComponent implements OnInit {
  public model = {
    module: null,
    project: null,
    subdirectory: '/data',
    singularName: null,
    pluralName: null,
  };

  public hidePath = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { modules: ModuleInterface[] },
    public dialogRef: MatDialogRef<CreateServiceDialogComponent>,
    private _servicesService: ServicesService,
    private _progressService: FsProgressService,
    private _message: FsMessage
  ) {}

  public ngOnInit(): void {
    this.dialogRef.updateSize('800px');
  }

  public generate() {
    const progressDialog = this._progressService.open();

    this._servicesService.generateService(this.model)
    .subscribe(
      () => {
        const type = this.model.subdirectory === '/data' ? 'data' : 'service';
        const servicePath = `${this.model.module.modulePath}${this.model.subdirectory}`;
        const singularName = `${
          kebabCase(this.model.singularName) + '.' + type
        }`;
        const service = {
          servicePath: servicePath,
          singularName: singularName + '.ts',
          name: servicePath.replace(/^src\//, '') + '/' + singularName,
          fullPath: servicePath + '/' + singularName,
        };

        progressDialog.close();
        this._message.success('Successfully Generated');

        this.dialogRef.close(service);
      },
      (response) => {
        progressDialog.close();
        this._message.error(
          (response.error && response.error.message) ||
            (response.body && response.body.error) ||
            response.message
        );
      }
    );
  }

  public changedSingularName() {
    this.model.pluralName = pluralize(this.model.singularName);
  }

  public moduleChanged() {
  }

  public toCamelCase() {
    this.model.singularName = camelize(this.model.singularName);
    this.model.pluralName = camelize(this.model.pluralName);
  }
}
