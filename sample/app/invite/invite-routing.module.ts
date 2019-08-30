import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {
  InviteComponent,
  SigninComponent,
  SignupComponent
} from './';
import { InviteResolve } from './';

const routes: Routes = [
  {
    path: 'signin/:guid',
    component: SigninComponent,
    resolve: {
      invite: InviteResolve
    },
  },
  {
    path: 'signup/:guid',
    component: SignupComponent,
    resolve: {
      invite: InviteResolve
    },
  },
  {
    path: ':guid',
    component: InviteComponent,
    resolve: {
      invite: InviteResolve
    },
  },
  { path: '**', redirectTo: '/signin' }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [InviteResolve]
})
export class InviteRoutingModule { }
