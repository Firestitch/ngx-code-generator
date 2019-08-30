import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SigninComponent, PasswordChangeComponent } from './';

const routes: Routes = [
  { path: 'passwordchange', component: PasswordChangeComponent },
  { path: '', component: SigninComponent, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SigninRoutingModule { }
