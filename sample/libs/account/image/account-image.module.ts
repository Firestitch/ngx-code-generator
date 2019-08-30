import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared';

import { AccountImageComponent } from './components';


@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [
    AccountImageComponent,
  ],
  exports: [
    AccountImageComponent,
  ]
})
export class AccountImageModule {}
