import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AccountResolve } from '../shared';
import {
  AuditsComponent,
  AccountComponent,
  OverviewComponent,
  RolesComponent,
} from '.';


export const routes: Routes = [
  {
    path: ':id',
    component: AccountComponent,
    resolve: {
      account: AccountResolve
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: OverviewComponent
      },
      {
        path: 'roles',
        component: RolesComponent
      },
      {
        path: 'audits',
        component: AuditsComponent
      }
    ]
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
