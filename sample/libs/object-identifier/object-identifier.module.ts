import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared';
import { ObjectIdentifierComponent } from '@libs/object-identifier/components';

@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [
    ObjectIdentifierComponent,
  ],
  exports: [
    ObjectIdentifierComponent,
  ]
})
export class ObjectIdentifierModule {}
