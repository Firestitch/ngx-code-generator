import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EnumsView } from './views';

export const routes: Routes = [{ path: '', component: EnumsView }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EnumsRoutingModule {}
