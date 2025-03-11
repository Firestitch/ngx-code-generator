import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FsMessage } from '@firestitch/message';
import { FsProgressService } from '@firestitch/progress';
import { FsPrompt } from '@firestitch/prompt';
import { upperFirst } from 'lodash-es';
import { camelize } from '@angular-devkit/core/src/utils/strings';

@Component({
  templateUrl: './generator.view.html',
  styleUrls: ['./generator.view.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    private _prompt: FsPrompt,
    private _cdRef: ChangeDetectorRef,
  ) {}

  public formDataChange(data) {
    this.formData = data;
  }

  public generate(model) {
    this._http.post('/generate', this.formData).subscribe(
      (response: { message: string }) => {
        this._message.success('Successfully Generated');
        this.resultLogs = response.message;
        this.activeTab = 1;
        this._cdRef.markForCheck();

        if (model.interfacePattern === 'dialog') {
          this._prompt
            .confirm({
              title: 'Open Dialog Sample Code',
              dialogConfig: { width: 'auto' },
              buttons: [
                {
                  label: 'Close',
                  cancel: true,
                },
              ],
              template: `<pre><code>import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

private _dialog = inject(MatDialog);

public open() {
  this._dialog.open(${upperFirst(
    camelize(this.formData.componentName + 'Component')
  )}, {
    data: { },
  })
    .afterClosed()
    .pipe(
      takeUntilDestroyed(this._destroyRef),
    )
    .subscribe((response) => {
    });
}</code></pre>`.replace(' ', '&nbsp;'),
            })
            .subscribe();
        }
      },
      (response) => {
        this._message.error(
          (response.error && response.error.message) ||
            (response.body && response.body.error) ||
            response.message
        );
      }
    );
  }
}
