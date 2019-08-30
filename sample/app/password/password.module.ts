import { NgModule } from '@angular/core';
import { FsPasswordModule } from '@firestitch/password';

import { SharedModule } from '../shared';
import { PasswordRoutingModule } from './password-routing.module';

import { ResetComponent, RequestComponent } from '.';

import { PasswordData } from './data';

@NgModule({
  imports: [
    PasswordRoutingModule,
    SharedModule,
    FsPasswordModule
  ],
  declarations: [
    RequestComponent,
    ResetComponent
  ],
  providers: [PasswordData],
})
export class PasswordModule {
}
