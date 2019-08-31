import { NgModule } from '@angular/core';
import { MatTooltipModule } from '@angular/material';
import { NgArrayPipesModule } from 'ngx-pipes';

import { ModulesListModule } from '@libs/modules-list';

import { ConstBuilderComponent, EnumsListComponent, GenerateConstComponent } from './components';
import { ConstsView } from './views';
import { SharedModule } from '../shared';
import { ConstsRoutingModule } from './consts-routing.module';


@NgModule({
  imports: [
    SharedModule,
    NgArrayPipesModule,
    MatTooltipModule,
    ConstsRoutingModule,

    ModulesListModule,
  ],
  declarations: [
    ConstsView,
    ConstBuilderComponent,
    GenerateConstComponent,
    EnumsListComponent,
  ],
  entryComponents: [
  ],
  providers: [
  ]
})
export class ConstsModule {
}
