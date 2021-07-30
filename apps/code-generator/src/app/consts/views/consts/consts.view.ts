import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FsMessage } from '@firestitch/message';
import { FsProgressService } from '@firestitch/progress';

@Component({
  templateUrl: './consts.view.html',
  styleUrls: ['./consts.view.scss'],
})
export class ConstsView {
  public error = '';
  public loading = false;

  public constPath = '';
  public code = '';

  constructor(
    private _http: HttpClient,
    private _message: FsMessage,
    private _progressService: FsProgressService
  ) {}

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
