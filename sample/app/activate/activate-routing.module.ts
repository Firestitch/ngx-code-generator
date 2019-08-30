import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {
  ActivateComponent,
  SignupComponent
} from '.';

import { ActivateResolve } from './resolvers';

const routes: Routes = [
  {
    path: 'signup/:guid',
    component: SignupComponent,
    resolve: {
      activate: ActivateResolve
    },
  },
  {
    path: ':guid',
    component: ActivateComponent,
    resolve: {
      activate: ActivateResolve
    },
  },
  { path: '**', redirectTo: '/signin' }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [ActivateResolve]
})
export class ActivateRoutingModule { }
