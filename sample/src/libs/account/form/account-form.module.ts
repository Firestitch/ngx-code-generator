import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared';
import {
  AccountFormComponent,
  AccountSocialComponent,
  TimezoneSelectComponent,
} from './components';


@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [
    AccountFormComponent,
    AccountSocialComponent,
    TimezoneSelectComponent,
  ],
  exports: [
    AccountFormComponent,
  ]
})
export class AccountFormModule {}
