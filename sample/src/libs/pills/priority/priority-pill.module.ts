import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared';

import { PriorityMenuComponent, PriorityPillComponent } from './components';

@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [
    PriorityPillComponent,
    PriorityMenuComponent,
  ],
  exports: [
    PriorityPillComponent,
    PriorityMenuComponent,
  ]
})
export class PriorityPillModule {}
