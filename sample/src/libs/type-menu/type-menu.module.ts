import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared';

import { TypeMenuComponent } from './components';


@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [
    TypeMenuComponent,
  ],
  exports: [
    TypeMenuComponent,
  ],
})
export class TypeMenuModule {}
