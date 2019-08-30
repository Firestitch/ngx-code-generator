import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {  TabsComponent,
          OverviewComponent  } from '.';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/account/overview',
  },
  {
    path: '',
    component: TabsComponent,
    children: [
      { path: 'overview', component: OverviewComponent }
    ],
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class AccountRoutingModule {
}
