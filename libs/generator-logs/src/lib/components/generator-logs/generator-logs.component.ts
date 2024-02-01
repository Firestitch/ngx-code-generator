import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'generator-logs',
  templateUrl: './generator-logs.component.html',
  styleUrls: ['./generator-logs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeneratorLogsComponent implements OnChanges {

  @Input() logs: string;
  public logsEntries: string[] = [];

  public ngOnChanges() {
    this.logsEntries = this.logs ? this.logs.split('\n') : [];
  }
}
