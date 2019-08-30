import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import {
  TasksComponent,
  TypesComponent,
  CategoriesComponent,
  StatusesComponent,
  WorkflowsComponent,
  WorkflowComponent,
  GeneralComponent,
  DesignComponent
} from '.';
import { WorkflowResolve } from '../shared';

export const routes: Routes = [

  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/admin/tasks/types'
  },
  {
    path: '',
    component: TasksComponent,
    children: [
      { path: 'types', component: TypesComponent },
      { path: 'categories', component: CategoriesComponent },
      { path: 'statuses', component: StatusesComponent },
      { path: 'workflows', component: WorkflowsComponent }
    ]
  },
  {
    path: 'workflow',
    component: WorkflowComponent,
    resolve: {
      workflow: WorkflowResolve
    },
    children: [
      { path: '', component: GeneralComponent }
    ]
  },
  {
    path: 'workflow/:workflow_id',
    component: WorkflowComponent,
    resolve: {
      workflow: WorkflowResolve
    },
    children: [
      { path: '', component: GeneralComponent },
      {
        path: 'design',
        component: DesignComponent,
        data: { bodyClass: 'body-workflow' }
      }
    ]
  },

  { path: 'admin-tasks', component: TasksComponent },
  { path: 'admin-tasks-types', component: TypesComponent }
];


@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class TasksRoutingModule {

}
