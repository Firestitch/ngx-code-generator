import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';

import { FsAutocompleteModule } from '@firestitch/autocomplete';

import {
  ModulesListComponent,
  CreateModuleDialogComponent,
  ParentDirectoryComponent,
  ProjectSelectComponent,
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
    MatCheckboxModule,
    MatSelectModule,

    FormsModule,
    ReactiveFormsModule,
    FsAutocompleteModule,
  ],
  declarations: [
    ModulesListComponent,
    CreateModuleDialogComponent,
    ModuleListItemPipe,
    ParentDirectoryComponent,
    ProjectSelectComponent,
  ],
  exports: [
    ModulesListComponent,
    ProjectSelectComponent,
  ]
})
export class ModulesAutocompleteModule {
}

