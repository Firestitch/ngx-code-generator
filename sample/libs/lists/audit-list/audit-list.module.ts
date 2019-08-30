import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared';
import { AccountImageModule } from '@libs/account/image';

import { AuditListComponent } from './components';


@NgModule({
  imports: [
    SharedModule,
    AccountImageModule,
  ],
  declarations: [
    AuditListComponent,
  ],
  exports: [
    AuditListComponent,
  ],
})
export class AuditListModule {}
