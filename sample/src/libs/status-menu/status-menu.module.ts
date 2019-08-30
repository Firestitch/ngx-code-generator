import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared';

import { StatusPillModule } from '@libs/pills/status';

import { StatusMenuComponent } from './components';

@NgModule({
  imports: [
    SharedModule,
    StatusPillModule,
  ],
  declarations: [
    StatusMenuComponent,
  ],
  exports: [
    StatusMenuComponent,
  ],
})
export class StatusMenuModule {}
