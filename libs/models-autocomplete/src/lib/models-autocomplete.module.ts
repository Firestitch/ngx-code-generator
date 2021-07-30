import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTooltipModule } from '@angular/material/tooltip';

import { FsAutocompleteModule } from '@firestitch/autocomplete';

import { ModelsListComponent } from './components/models-list';

@NgModule({
  imports: [
    MatTooltipModule,
    MatAutocompleteModule,
    FormsModule,
    ReactiveFormsModule,
    FsAutocompleteModule,
  ],
  declarations: [ModelsListComponent],
  exports: [ModelsListComponent],
})
export class ModelsAutocompleteModule {}
