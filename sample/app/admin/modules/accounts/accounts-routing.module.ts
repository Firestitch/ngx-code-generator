import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
  AccountsComponent,
  RolesComponent,
  TabsComponent,
  SessionsComponent
} from '.';


export const routes: Routes = [
  {
    path: '',
    component: TabsComponent,
    children: [
      { path: 'roles', component: RolesComponent },
      { path: 'sessions', component: SessionsComponent },
      { path: '', pathMatch: 'full', component: AccountsComponent },
    ]
  },
  {
    path: '',
    loadChildren: './../account/account.module#AccountModule',
  }
];


@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class AccountsRoutingModule {

}
