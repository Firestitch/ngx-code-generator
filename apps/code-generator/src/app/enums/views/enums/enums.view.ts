import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { FsMessage } from '@firestitch/message';
import { FsProgressService } from '@firestitch/progress';


@Component({
  templateUrl: './enums.view.html',
  styleUrls: ['./enums.view.scss'],
})
export class EnumsView {
  public loading = false;

  public enumPath = '';
  public enumName = '';
  public modulePath = '';
  public moduleName = '';
  public code = '';
  public successfulGeneration = false;

  constructor(
    private _http: HttpClient,
    private _message: FsMessage,
    private _progressService: FsProgressService,
    private _router: Router,
  ) {}

  public get canGenerateConst(): boolean {
    return !!(this.enumName && this.enumPath && this.modulePath && this.moduleName);
  }

  public save(data) {
    this.enumPath = '';
    this.code = '';
    this.successfulGeneration = false;

    const progressDialog = this._progressService.open();

    this._http.post('/generate/enum', data).subscribe(
      (response: { code: string; path: string }) => {
        this.loading = false;
        this.successfulGeneration = true;
        this.code = response.code;
        this.enumPath = response.path;
        this.enumName = data.name;
        this.modulePath = data.module.modulePath;
        this.moduleName = data.module.name;

        progressDialog.close();
        this._message.success('Successfully Generated');
      },
      (response) => {
        this.loading = false;
        this.enumPath = '';
        this.enumName = '';
        this.modulePath = '';
        this.moduleName = '';
        this.code = '';

        progressDialog.close();
        this._message.error(
          (response.error && response.error.message) ||
            (response.body && response.body.error) ||
            response.message
        );
      }
    );
  }

  public navigateToConstPage(): void {
    this._router.navigate(['/consts'], {
      queryParams: {
        enumPath: this.enumPath,
        enumName: this.enumName,
        modulePath: this.modulePath,
        moduleName: this.moduleName,
      }
    });
  }
}
