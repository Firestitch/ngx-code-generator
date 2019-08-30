import { NgModule } from '@angular/core';

import { TimerService } from './services/timer.service';
import { TimeEntryData } from './data/time-entry.data';


@NgModule({
  providers: [
    TimeEntryData,
    TimerService,
  ]
})
export class TimeEntryModule {}
