import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared';

import { WorkspaceCreateComponent } from './components';


@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [
    WorkspaceCreateComponent,
  ],
  exports: [
    WorkspaceCreateComponent,
  ],
  entryComponents: [
    WorkspaceCreateComponent,
  ]
})
export class WorkspaceCreateDialogModule {}
