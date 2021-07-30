import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ConstsView } from './views';

export const routes: Routes = [{ path: '', component: ConstsView }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConstsRoutingModule {}
