import { NgModule } from '@angular/core';

import {
  DocsComponent,
  TypesComponent,
  TypeComponent,
  GeneralComponent,
  StatusesComponent,
  CategoriesComponent
} from '.';
import { DocsRoutingModule } from './docs-routing.module';
import { SharedModule } from '@app/shared';
import { AdminSharedModule } from '../shared/admin-shared.module';

@NgModule({
  imports: [
    DocsRoutingModule,
    SharedModule,
    AdminSharedModule
  ],
  declarations: [
    DocsComponent,
    TypesComponent,
    TypeComponent,
    GeneralComponent,
    StatusesComponent,
    CategoriesComponent
  ],
  entryComponents: [

  ],
  providers: [

  ]
})
export class DocsModule {
}
