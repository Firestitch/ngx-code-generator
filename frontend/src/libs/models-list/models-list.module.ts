import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatAutocompleteModule, MatTooltipModule } from '@angular/material';
import { SharedModule } from '@app/shared';
import { ModelsListComponent, } from './components/models-list';


@NgModule({
  imports: [
    SharedModule,
    MatTooltipModule,
    MatAutocompleteModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    ModelsListComponent,
  ],
  exports: [
    ModelsListComponent,
  ]
})
export class ModelsListModule {
}

