import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared';

import { OrLineComponent } from './components';


@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [
    OrLineComponent,
  ],
  exports: [
    OrLineComponent,
  ],
})
export class OrLineModule {}
