import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
  TimeEntriesComponent
} from './';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/reports/timeentries'
  },
  {
    path: 'timeentries',
    component: TimeEntriesComponent
  }
];


@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
