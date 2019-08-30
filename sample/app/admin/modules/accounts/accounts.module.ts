import { NgModule } from '@angular/core';

import { RoleEditDialogModule } from '@libs/dialogs/role-edit';
import { InvitesListDialogModule } from '@libs/dialogs/invites-list';
import { SharedModule } from '@app/shared';

import {
  TabsComponent,
  RolesComponent,
  AccountsComponent,
  SessionsComponent
} from '.';

import { AccountsRoutingModule } from './accounts-routing.module';
import { AdminSharedModule } from '../shared/admin-shared.module';
import { SessionData } from './data';
import { DateDurationPipe } from './pipes/duration.pipe';


@NgModule({
  imports: [
    SharedModule,
    AdminSharedModule,
    AccountsRoutingModule,
    RoleEditDialogModule,
    InvitesListDialogModule,
  ],
  declarations: [
    TabsComponent,
    RolesComponent,
    AccountsComponent,
    SessionsComponent,
    DateDurationPipe
  ],
  providers: [
    SessionData
  ]
})
export class AccountsModule {
}
