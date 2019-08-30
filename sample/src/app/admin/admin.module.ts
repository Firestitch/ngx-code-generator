import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminSharedModule } from './modules/shared/admin-shared.module';


@NgModule({
  imports: [
    SharedModule,
    AdminSharedModule,
    AdminRoutingModule
  ]
})
export class AdminModule {
}
