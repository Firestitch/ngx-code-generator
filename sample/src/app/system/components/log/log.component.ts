import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { SystemData } from '@app/system/data';


@Component({
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.scss']
})
export class LogComponent implements OnInit {

  public log;

  constructor(private _systemData: SystemData,
              @Inject(MAT_DIALOG_DATA) public data) {}

  public ngOnInit() {

    if (this.data.log.id) {
      this._systemData.logsGet(this.data.log.id)
      .subscribe(log => {
        this.log = log;

        try {
          this.log.backtrace = JSON.parse(this.log.backtrace);
        } catch (e) {}

        try {
          this.log.server = JSON.parse(this.log.server);
        } catch (e) {}
      });
    }
  }
}
