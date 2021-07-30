import { Component } from '@angular/core';
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
  public code = '';

  constructor(
    private _http: HttpClient,
    private _message: FsMessage,
    private _progressService: FsProgressService
  ) {}

  public save(data) {
    this.enumPath = '';
    this.code = '';

    const progressDialog = this._progressService.open();

    this._http.post('/generate/enum', data).subscribe(
      (response: { code: string; path: string }) => {
        this.loading = false;
        this.code = response.code;
        this.enumPath = response.path;

        progressDialog.close();
        this._message.success('Successfully Generated');
      },
      (response) => {
        this.loading = false;
        this.enumPath = '';
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
