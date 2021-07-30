import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { InterfacesView } from './views/interfaces';

export const routes: Routes = [
  { path: '', component: InterfacesView, },
];


@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [ RouterModule ],
})
export class InterfacesRoutingModule {}
