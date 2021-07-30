import { NgModule } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgArrayPipesModule } from 'ngx-pipes';

import { ModulesAutocompleteModule } from '@codegenerator/modules-autocomplete';
import { GeneratorCodeModule } from '@codegenerator/generator-code';

import {
  ConstBuilderComponent,
  EnumsListComponent,
  GenerateConstComponent,
} from './components';
import { ConstsView } from './views';
import { ConstsRoutingModule } from './consts-routing.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FsLabelModule } from '@firestitch/label';
import { CommonModule } from '@angular/common';
import { FsAutocompleteModule } from '@firestitch/autocomplete';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    GeneratorCodeModule,
    NgArrayPipesModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    FsLabelModule,
    FsAutocompleteModule,
    ConstsRoutingModule,

    ModulesAutocompleteModule,
  ],
  declarations: [
    ConstsView,
    ConstBuilderComponent,
    GenerateConstComponent,
    EnumsListComponent,
  ],
  entryComponents: [],
  providers: [],
})
export class ConstsModule {}
