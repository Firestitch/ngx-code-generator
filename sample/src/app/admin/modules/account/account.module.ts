import { NgModule } from '@angular/core';

import {
  AccountComponent,
  AuditsComponent,
  OverviewComponent,
  RolesComponent,
} from '.';

import { AccountRoutingModule } from './account-routing.module';
import { AdminSharedModule } from '../shared/admin-shared.module';
import { SharedModule } from '@app/shared';

import { AccountFormModule } from '@libs/account/form';
import { AuditListModule } from '@libs/lists/audit-list';


@NgModule({
  imports: [
    SharedModule,
    AdminSharedModule,
    AccountRoutingModule,
    AccountFormModule,
    AuditListModule,
  ],
  declarations: [
    AccountComponent,
    AuditsComponent,
    OverviewComponent,
    RolesComponent,
  ]
})
export class AccountModule {
}
