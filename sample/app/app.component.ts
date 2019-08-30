import { Component, ViewEncapsulation } from '@angular/core';

import { ObjectDrawerService } from 'libs/drawers/drawer';
import { TimerService } from './time-entry';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  // Timer service injected here to construct service on app init. Don't remove
  // Global Drawer service injected here to construct service on app init. Don't remove
  constructor(
    private _timerService: TimerService,
    private _objectDrawerService: ObjectDrawerService
  ) { }
}
