import { NgModule } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgArrayPipesModule } from 'ngx-pipes';

import { ModulesAutocompleteModule } from '@codegenerator/modules-autocomplete';
import { GeneratorCodeModule } from '@codegenerator/generator-code';

import { EnumBuilderComponent, GenerateEnumComponent } from './components';
import { EnumsView } from './views';
import { EnumsRoutingModule } from './enums-routing.module';
import { MatCardModule } from '@angular/material/card';
import { FsLabelModule } from '@firestitch/label';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgArrayPipesModule,

    MatTooltipModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,

    FsLabelModule,

    EnumsRoutingModule,
    ModulesAutocompleteModule,
    GeneratorCodeModule,
  ],
  declarations: [EnumsView, EnumBuilderComponent, GenerateEnumComponent],
})
export class EnumsModule {}
