import { NgModule } from '@angular/core';
import { MatTooltipModule } from '@angular/material';
import { NgArrayPipesModule } from 'ngx-pipes';

import { ModulesListModule } from '@libs/modules-list';

import { EnumBuilderComponent, GenerateEnumComponent } from './components';
import { EnumsView } from './views';
import { SharedModule } from '../shared';
import { EnumsRoutingModule } from './enums-routing.module';


@NgModule({
  imports: [
    SharedModule,
    NgArrayPipesModule,
    MatTooltipModule,
    EnumsRoutingModule,

    ModulesListModule,
  ],
  declarations: [
    EnumsView,
    EnumBuilderComponent,
    GenerateEnumComponent,
  ],
  entryComponents: [
  ],
  providers: [
  ]
})
export class EnumsModule {
}
