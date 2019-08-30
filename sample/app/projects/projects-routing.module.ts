import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {
  TasksComponent,
  ProjectsComponent,
} from './views';


const routes: Routes = [
  { path: '',
    pathMatch: 'full',
    component: ProjectsComponent,
  },
  {
    path: 'tasks',
    component: TasksComponent
  },
  { path: '',
    loadChildren: './modules/project/project.module#ProjectModule',
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectsRoutingModule { }
