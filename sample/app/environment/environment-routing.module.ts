import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {
  MembersComponent,
  RolesComponent,
  SettingsComponent,
  TabsComponent,
} from '.';

import { EnvironmentResolve } from './resolves';

const routes: Routes = [
  {
    path: ':id',
    redirectTo: ':id/settings',
    pathMatch: 'full'
  },
  {
    path: ':id',
    resolve: {
      environment: EnvironmentResolve,
    },
    children: [
      {
        path: '',
        component: TabsComponent,
        children: [
          { path: 'settings', component: SettingsComponent },
          { path: 'members', component: MembersComponent, data: {accountType: 'person'} },
          { path: 'roles', component: RolesComponent },
          { path: 'apikeys', component: MembersComponent, data: {accountType: 'api'} },
        ]
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EnvironmentRoutingModule { }
