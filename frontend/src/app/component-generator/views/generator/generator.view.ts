import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FsMessage } from '@firestitch/message';
import { FsProgressService } from '@firestitch/progress';
import { FsPrompt } from '@firestitch/prompt';
import { camelCase, upperFirst } from 'lodash';
import { camelize } from '@angular-devkit/core/src/utils/strings';


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
    private _prompt: FsPrompt
  ) {}

  public formDataChange(data) {
    this.formData = data;
  }

  public generate(model) {
    const progressDialog = this._progressService.open();

    this._http.post('/generate', this.formData)
      .subscribe((response: { message: string }) => {
        progressDialog.close();
        this._message.success('Successfully Generated');
        this.resultLogs = response.message;
        this.activeTab = 1;


        if (model.interfacePattern === 'dialog') {
          this._prompt.confirm({
            title: 'Open Dialog Sample Code',
            dialogConfig: { width: 'auto' },
            buttons: [
              {
                label: 'Close',
                cancel: true
              }
            ],
            template: `<pre><code>constructor(private _dialog: MatDialog) {}

public open() {
  const dialogRef = this._dialog.open(${upperFirst(camelize(this.formData.componentName + 'Component'))}, {
    data: { },
  });

  dialogRef.afterClosed()
  .pipe(
    takeUntil(this._destroy$),
  )
  .subscribe((response) => {

  });
}</code></pre>`.replace(' ', '&nbsp;')
          }).subscribe(() => {});
        }
      },
      (response) => {
        progressDialog.close();
        this._message.error(response.error && response.error.message || (response.body && response.body.error) || response.message);
      });
  }
}
