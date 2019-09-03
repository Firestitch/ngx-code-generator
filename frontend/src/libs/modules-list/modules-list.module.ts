import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatAutocompleteModule, MatTooltipModule } from '@angular/material';
import { SharedModule } from '@app/shared';
import {
  ModulesListComponent,
  CreateModuleDialogComponent,
  ParentDirectoryComponent,
} from './components';
import { ModuleListItemPipe } from './pipes';

@NgModule({
  imports: [
    SharedModule,
    MatTooltipModule,
    MatAutocompleteModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    ModulesListComponent,
    CreateModuleDialogComponent,
    ModuleListItemPipe,
    ParentDirectoryComponent,
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

