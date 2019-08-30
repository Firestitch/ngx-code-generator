import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared';

import { RoleEditComponent } from './components';


@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [
    RoleEditComponent,
  ],
  exports: [
    RoleEditComponent,
  ],
  entryComponents: [
    RoleEditComponent,
  ]
})
export class RoleEditDialogModule {}
