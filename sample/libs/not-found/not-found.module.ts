import { NgModule } from '@angular/core';

import { NotFoundComponent } from './components';
import { NotFoundRoutingModule } from './not-found-routing.module';



@NgModule({
  imports: [
    NotFoundRoutingModule
  ],
  declarations: [
    NotFoundComponent,
  ]
})
export class NotFoundModule {}
