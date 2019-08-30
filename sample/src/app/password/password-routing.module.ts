import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ResetComponent, RequestComponent } from '.';

export const routes: Routes = [
  {
    path: 'request',
    component: RequestComponent,
    data: { bodyClass: 'body-card' }
  },
  {
    path: 'reset',
    component: ResetComponent,
    data: { bodyClass: 'body-card' }
  },
  {
    path: 'reset/:code',
    component: ResetComponent,
    data: { bodyClass: 'body-card' }
  }
];


@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class PasswordRoutingModule {
}
