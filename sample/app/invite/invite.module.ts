import { NgModule } from '@angular/core';

import { OrLineModule } from '@libs/or-line';
import { SocialButtonModule } from '@libs/social-button';

import { SharedModule } from '../shared';

import { InviteRoutingModule } from './invite-routing.module';
import {
  InviteComponent,
  SigninComponent,
  SignupComponent
} from './';


@NgModule({
  imports: [
    InviteRoutingModule,
    SharedModule,
    OrLineModule,
    SocialButtonModule,
  ],
  declarations: [
    InviteComponent,
    SigninComponent,
    SignupComponent
  ],
})
export class InviteModule { }
