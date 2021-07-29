import { NgModule } from '@angular/core';
import { MatTooltipModule } from '@angular/material';
import { NgArrayPipesModule } from 'ngx-pipes';

import { ModulesListModule } from '@libs/modules-list';
import { ModelsListModule } from '@libs/models-list';

import { InterfacesView } from './views/interfaces';
import { SharedModule } from '../shared';
import { InterfacesRoutingModule } from './interfaces-routing.module';
import { InterfaceGeneratorFormComponent } from './components/generator-form/interface-generator-form.component';


@NgModule({
  imports: [
    SharedModule,
    NgArrayPipesModule,
    MatTooltipModule,
    InterfacesRoutingModule,

    ModulesListModule,
    ModelsListModule,
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
