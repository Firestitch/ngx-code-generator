import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GeneratorView } from './views';

export const routes: Routes = [{ path: '', component: GeneratorView }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ComponentGeneratorRoutingModule {}
