import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { FsAutocompleteModule } from '@firestitch/autocomplete';

import {
  ModulesListComponent,
  CreateModuleDialogComponent,
  ParentDirectoryComponent,
} from './components';
import { ModuleListItemPipe } from './pipes';


@NgModule({
  imports: [
    CommonModule,
    MatTooltipModule,
    MatAutocompleteModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    FsAutocompleteModule,
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
export class ModulesAutocompleteModule {
}

