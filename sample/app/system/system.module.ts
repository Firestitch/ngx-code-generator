import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '@app/shared';
import {  CronsComponent,
          LogsServerComponent,
          LogsTabsComponent,
          LogsUpgradeComponent,
          LogsApiComponent,
          FilesComponent,
          ApiLogComponent,
          SettingsComponent,
          ProcessesComponent } from '.';

import { FsPasswordModule } from '@firestitch/password';

import { SystemRoutingModule } from './system-routing.module';
import { CronData, SystemData } from './data';
import { LogComponent } from './components';
import { KeyNameValueModule } from 'libs/pipes/key-name-value';

@NgModule({
  imports: [
    SharedModule,
    RouterModule,
    FsPasswordModule,
    SystemRoutingModule,
    KeyNameValueModule
  ],
  declarations: [
    CronsComponent,
    LogsTabsComponent,
    FilesComponent,
    LogsServerComponent,
    LogsUpgradeComponent,
    LogComponent,
    SettingsComponent,
    LogsApiComponent,
    ApiLogComponent,
    ProcessesComponent
  ],
  providers: [
    SystemData,
    CronData
  ],
  entryComponents: [
    LogComponent,
    ApiLogComponent
  ]
})
export class SystemModule {
}
