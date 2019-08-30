import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared';
import {
  AccountRequestComponent,
  InvitesListDialogComponent
} from './components';

@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [
    InvitesListDialogComponent,
    AccountRequestComponent,
  ],
  exports: [
    InvitesListDialogComponent,
    AccountRequestComponent,
  ],
  entryComponents: [
    InvitesListDialogComponent,
    AccountRequestComponent,
  ]
})
export class InvitesListDialogModule {}
