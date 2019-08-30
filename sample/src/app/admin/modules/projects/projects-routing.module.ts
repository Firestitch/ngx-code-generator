import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
  ProjectsComponent,
  StatusesComponent
} from '.';


export const routes: Routes = [
  {
    path: '',
    component: ProjectsComponent,
    children: [
      { path: 'statuses', component: StatusesComponent }
    ]
  }
];


@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ProjectsRoutingModule {

}
