import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FsMessage } from '@firestitch/message';
import { FsProgressService } from '@firestitch/progress';
import { ActivatedRoute } from '@angular/router';

@Component({
  templateUrl: './consts.view.html',
  styleUrls: ['./consts.view.scss'],
})
export class ConstsView implements OnInit {
  public error = '';
  public loading = false;

  public constPath = '';
  public code = '';

  public externalParams: Record<string, unknown>;

  constructor(
    private _http: HttpClient,
    private _message: FsMessage,
    private _progressService: FsProgressService,
    private _route: ActivatedRoute,
  ) {}

  public ngOnInit(): void {
    this._fetchParamsFromRoute();
  }

  private _fetchParamsFromRoute(): void {
    this.externalParams = {
      enumPath: this._route.snapshot.queryParams.enumPath,
      enumName: this._route.snapshot.queryParams.enumName,
      modulePath: this._route.snapshot.queryParams.modulePath,
      moduleName: this._route.snapshot.queryParams.moduleName,
    }
  }

  public save(data) {
    this.constPath = '';
    this.code = '';

    const progressDialog = this._progressService.open();

    this._http.post('/generate/const', data).subscribe(
      (response: { code: string; path: string }) => {
        this.loading = false;
        this.error = '';
        this.code = response.code;
        this.constPath = response.path;

        progressDialog.close();
        this._message.success('Successfully Generated');
      },
      (response) => {
        this.loading = false;
        this.constPath = '';
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
}
