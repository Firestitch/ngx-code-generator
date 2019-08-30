import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FsBadgeModule } from '@firestitch/badge';

import { SharedModule } from '@app/shared';

import { AccountAssignPillComponent } from './components';


@NgModule({
  imports: [
    SharedModule,
    FlexLayoutModule,
    FsBadgeModule,
  ],
  declarations: [
    AccountAssignPillComponent
  ],
  exports: [
    AccountAssignPillComponent,
  ]
})
export class AccountAssignPillModule {}
