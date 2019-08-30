import { Component, OnInit, Inject } from '@angular/core';
import { chain } from 'lodash-es';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { SystemData } from '@app/system/data';
import { ApiLogStates } from 'app/system/consts';


@Component({
  templateUrl: './api-log.component.html',
  styleUrls: ['./api-log.component.scss']
})
export class ApiLogComponent implements OnInit {

  public api_log;
  public apiLogStates;

  constructor(private _systemData: SystemData,
              private _dialogRef: MatDialogRef<ApiLogComponent>,
              @Inject(MAT_DIALOG_DATA) public data) {}

  public ngOnInit() {


    this.apiLogStates = chain(ApiLogStates)
                      .keyBy('value')
                      .mapValues('name')
                      .value();

    if (this.data.api_log.id) {
      this._systemData.logsApiGet(this.data.api_log.id)
      .subscribe(api_log => {
        this.api_log = api_log;
      });
    }
  }
}
