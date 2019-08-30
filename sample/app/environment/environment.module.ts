import { NgModule } from '@angular/core';

import { RoleEditDialogModule } from '@libs/dialogs/role-edit';
import { InvitesListDialogModule } from '@libs/dialogs/invites-list';

import { SharedModule } from '../shared';

import { EnvironmentRoutingModule } from './environment-routing.module';

import {
  MembersComponent,
  RolesComponent,
  SettingsComponent,
  TabsComponent,
  MemberComponent,
} from '.';

import { EnvironmentResolve } from './resolves';

@NgModule({
  imports: [
    EnvironmentRoutingModule,
    SharedModule,
    RoleEditDialogModule,
    InvitesListDialogModule,
  ],
  declarations: [
    MembersComponent,
    RolesComponent,
    SettingsComponent,
    TabsComponent,
    MemberComponent
  ],
  providers: [EnvironmentResolve],
  entryComponents: [
    MemberComponent,
  ]
})
export class EnvironmentModule { }
