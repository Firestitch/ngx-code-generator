import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './components';

export const routes: Routes = [
   { path: '', pathMatch: 'full', component: NotFoundComponent, data: { bodyClass: 'body-notfound' } }
];


@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class NotFoundRoutingModule { }
