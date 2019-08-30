import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared';

import { StatusPillComponent } from './components';

@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [
    StatusPillComponent,
  ],
  exports: [
    StatusPillComponent,
  ]
})
export class StatusPillModule {}
