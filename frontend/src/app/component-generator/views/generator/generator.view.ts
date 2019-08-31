import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FsMessage } from '@firestitch/message';
import { FsProgressService } from '@firestitch/progress';

@Component({
  templateUrl: './generator.view.html',
  styleUrls: [ './generator.view.scss' ]
})
export class GeneratorView {
  public formData = null;
  public resultLogs: string;
  public error: string;
  public activeTab = 0;

  constructor(
    private _http: HttpClient,
    private _message: FsMessage,
    private _progressService: FsProgressService,
  ) {}

  public formDataChange(data) {
    this.formData = data;
  }

  public generate() {
    const progressDialog = this._progressService.open();

    this._http.post('/generate', this.formData)
      .subscribe((response: { message: string }) => {
        progressDialog.close();
        this._message.success('Successfully Generated');
        this.resultLogs = response.message;
        this.activeTab = 1;
      },
      (response) => {
        progressDialog.close();
        this._message.error(response.error && response.error.message || (response.body && response.body.error) || response.message);
      });
  }
}
