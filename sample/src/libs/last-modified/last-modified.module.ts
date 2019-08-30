import { NgModule } from '@angular/core';

import { FsDateModule } from '@firestitch/date';

import { SharedModule } from '@app/shared';
import { AccountImageModule } from '@libs/account/image';

import { LastModifiedComponent } from './components';


@NgModule({
  imports: [
    SharedModule,
    FsDateModule,
    AccountImageModule,
  ],
  declarations: [
    LastModifiedComponent,
  ],
  exports: [
    LastModifiedComponent,
  ],
})
export class LastModifiedModule {}
