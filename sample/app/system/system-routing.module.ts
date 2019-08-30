import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {  CronsComponent,
          LogsServerComponent,
          SettingsComponent,
          FilesComponent,
          LogsUpgradeComponent,
          LogsApiComponent,
          ProcessesComponent
         } from '.';
import { LogsTabsComponent } from './components';

const routes: Routes = [
  { path: '', redirectTo: 'settings', pathMatch: 'full' },
  { path: '',
    children: [

      { path: 'crons', component: CronsComponent },
      { path: 'files', component: FilesComponent },
      { path: 'processes', component: ProcessesComponent },
      { path: 'logs', component: LogsTabsComponent,
        children: [
          { path: '', redirectTo: 'server', pathMatch: 'full' },
          { path: 'server', component: LogsServerComponent },
          { path: 'upgrade', component: LogsUpgradeComponent },
          { path: 'api', component: LogsApiComponent },
        ]
      },
      { path: 'settings', component: SettingsComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SystemRoutingModule { }
