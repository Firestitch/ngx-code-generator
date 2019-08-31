import { NgModule } from '@angular/core';
import { MatTooltipModule } from '@angular/material';
import { NgArrayPipesModule } from 'ngx-pipes';

import { ModulesListModule } from '@libs/modules-list';
import { ComponentGeneratorRoutingModule } from './component-generator-routing.module';
import { SharedModule } from '../shared';
import { GeneratorView } from './views';
import { ServicesService } from './services';
import { CreateServiceDialogComponent, ServicesListComponent } from './components/services-list';
import { ServiceListItemPipe } from './pipes/service-list-item.pipe';
import { GeneratorFormComponent } from './components/generator-form/generator-form.component';


@NgModule({
  imports: [
    SharedModule,
    NgArrayPipesModule,
    MatTooltipModule,
    ComponentGeneratorRoutingModule,

    ModulesListModule,
  ],
  declarations: [
    GeneratorView,
    GeneratorFormComponent,

    ServicesListComponent,
    CreateServiceDialogComponent,

    ServiceListItemPipe,
  ],
  entryComponents: [
    CreateServiceDialogComponent,
  ],
  providers: [
    ServicesService
  ]
})
export class ComponentGeneratorModule {
}
