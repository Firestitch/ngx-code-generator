import { NgModule } from '@angular/core';

import { FsAutocompleteModule } from '@firestitch/autocomplete';

import { SharedModule } from '@app/shared';
import { ObjectIdentifierModule } from '@libs/object-identifier';
import { AccountImageModule } from '@libs/account/image';

import {
  TimerComponent,
  TimeEntryDialogComponent,
  TimerRecentComponent,
  TimerEntryFormComponent,
  TimerActionsComponent,
} from './components';


@NgModule({
  imports: [
    FsAutocompleteModule,
    SharedModule,
    ObjectIdentifierModule,
    AccountImageModule,
  ],
  declarations: [
    TimerComponent,
    TimeEntryDialogComponent,
    TimerRecentComponent,
    TimerEntryFormComponent,
    TimerActionsComponent,
  ],
  exports: [
    TimerComponent,
    TimeEntryDialogComponent,
  ],
  entryComponents: [
    TimerComponent,
  ]
})
export class TimerModule {}
