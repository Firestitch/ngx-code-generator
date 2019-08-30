import { NgModule } from '@angular/core';

import { SharedModule } from '../shared';

import { ActivateRoutingModule } from './activate-routing.module';

import {
  ActivateComponent,
  SignupComponent
} from './';


@NgModule({
  imports: [
    ActivateRoutingModule,
    SharedModule
  ],
  declarations: [
    ActivateComponent,
    SignupComponent
  ],
})
export class ActivateModule { }
