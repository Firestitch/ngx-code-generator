import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { FsMessage } from '@firestitch/message';
import { FsProgressService } from '@firestitch/progress';

import { of, switchMap, tap } from 'rxjs';
import * as pluralize from 'pluralize';


@Component({
  templateUrl: './enums.view.html',
  styleUrls: ['./enums.view.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    private _cdRef: ChangeDetectorRef,
  ) {}

  public get canGenerateConst(): boolean {
    return !!(this.enumName && this.enumPath && this.modulePath && this.moduleName);
  }

  public save(data) {
    this.enumPath = '';
    this.code = '';
    this.successfulGeneration = false;

    const progressDialog = this._progressService.open();

    this._http.post('/generate/enum', data)
    .pipe(
      tap((response: { code: string; path: string }) => {
        this.code = response.code;
        this.enumPath = response.path;
        this.enumName = data.name;
        this.modulePath = data.module.modulePath;
        this.moduleName = data.module.name;
      }),
      switchMap(() => {
        const consts = data.enums
          .map((item) => item.name);

        const members = data.enums
          .map((item) => item.text);

        return data.const ? 
          this._http.post('/generate/const', {
            module: data.module,
            consts,
            enumData: {
              members,
              name: data.name,
            },
            enum: {
              enumPath: `${data.module.modulePath}/enums`,
            },
            name: pluralize(data.name),
          }) : of(null);
      })
    )
    .subscribe(() => {
        this.loading = false;
        this.successfulGeneration = true;
        this._cdRef.markForCheck();

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
        this._cdRef.markForCheck();

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
