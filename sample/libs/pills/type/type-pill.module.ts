import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared';

import { TypePillComponent } from './components';

@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [
    TypePillComponent,
  ],
  exports: [
    TypePillComponent,
  ]
})
export class TypePillModule {}
