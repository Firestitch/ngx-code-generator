import { NgModule } from '@angular/core';

import { MatTooltipModule } from '@angular/material';
import { SharedModule } from '@app/shared';
import { ModulesListComponent, CreateModuleDialogComponent } from './components';
import { ModuleListItemPipe } from './pipes';

@NgModule({
  imports: [
    SharedModule,
    MatTooltipModule,
  ],
  declarations: [
    ModulesListComponent,
    CreateModuleDialogComponent,
    ModuleListItemPipe
  ],
  entryComponents: [
    CreateModuleDialogComponent,
  ],
  exports: [
    ModulesListComponent,
  ]
})
export class ModulesListModule {
}

