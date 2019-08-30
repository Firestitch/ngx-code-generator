import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { NgForm, ControlContainer } from '@angular/forms';


import { guid } from '@firestitch/common';

import { TimezoneData } from '@app/core';
import { Timezone } from '@app/shared/interfaces/timezone';


@Component({
  selector: 'app-timezone-select',
  templateUrl: './timezone-select.component.html',
  styleUrls: ['./timezone-select.component.scss'],
  viewProviders: [ { provide: ControlContainer, useExisting: NgForm } ]
})
export class TimezoneSelectComponent implements OnInit {

  @Input() public placeholder = 'Timezone';
  @Input() public required = false;
  @Input() public disabled = false;
  @Output() public timezoneChange = new EventEmitter<string>();

  private _timezone: string = null;
  @Input() public set timezone(value: string) {
    if (value && value !== this._timezone) {
      this._timezone = value;
      this.timezoneChange.emit(this.timezone);
    }
  };

  public get timezone(): string {
    return this._timezone;
  }

  public guid: string = guid();

  public timezones: Timezone[] = [];

  private _browserTimezone: string = Intl.DateTimeFormat().resolvedOptions().timeZone;

  constructor(
    private _timezoneData: TimezoneData
  ) { }

  public ngOnInit() {
    this._timezoneData.gets()
      .subscribe((response: Timezone[]) => {
        this.timezones = response;

        if (!this.timezone) {
          this.timezone = this._browserTimezone;
        }
      });
  }
}
