import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared';

import { SubscribersComponent } from './components';


@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [
    SubscribersComponent,
  ],
  exports: [
    SubscribersComponent,
  ]
})
export class SubscribersModule {}
