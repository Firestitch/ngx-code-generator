import { NgModule } from '@angular/core';
import { MatFormFieldModule, MatSelectModule } from '@angular/material';

import { SharedModule } from '@app/shared';

import { AccountAssignPillModule } from '../assign-pill/assign-pill.module';

import { AccountAssignMenuComponent } from './assign-menu.component';

@NgModule({
  imports: [
    SharedModule,
    MatFormFieldModule,
    MatSelectModule,
    AccountAssignPillModule,
  ],
  declarations: [
    AccountAssignMenuComponent
  ],
  exports: [
    AccountAssignMenuComponent,
  ]
})
export class AccountAssignToMenuModule {}
