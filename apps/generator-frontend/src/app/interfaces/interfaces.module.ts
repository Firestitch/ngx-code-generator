import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';

import { FsLabelModule } from '@firestitch/label';

import { NgArrayPipesModule } from 'ngx-pipes';

import { ModulesAutocompleteModule } from '@codegenerator/modules-autocomplete';
import { ModelsAutocompleteModule } from '@codegenerator/models-autocomplete';
import { GeneratorCodeModule } from '@codegenerator/generator-code';

import { InterfacesView } from './views/interfaces';
import { InterfacesRoutingModule } from './interfaces-routing.module';
import { InterfaceGeneratorFormComponent } from './components/generator-form/interface-generator-form.component';


@NgModule({
  imports: [
    FormsModule,
    NgArrayPipesModule,
    MatTooltipModule,
    MatCardModule,
    MatButtonModule,
    GeneratorCodeModule,
    InterfacesRoutingModule,
    ModulesAutocompleteModule,
    ModelsAutocompleteModule,

    FsLabelModule,
  ],
  declarations: [
    InterfacesView,

    InterfaceGeneratorFormComponent,
  ],
  providers: [
  ]
})
export class InterfacesModule {
}
