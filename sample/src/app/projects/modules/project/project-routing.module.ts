import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
  OverviewComponent,
  SettingsComponent,
  TagsComponent,
  AuditsComponent,
  DocsComponent,
  ImagesComponent,
  TasksComponent,
} from '.';

import { ProjectResolve } from './resolves';
import { TaskResolve } from './modules/shared/resolves';
import { ProjectsTaskAuditsListComponent } from './modules/shared/components';

const routes: Routes = [
  { path: '',
    pathMatch: 'full',
    component: OverviewComponent,
    resolve: {
       project: ProjectResolve
    },
    children: [
      { path: '', component: SettingsComponent }
    ]
  },
  {
    path: 'create',
    component: OverviewComponent,
    resolve: {
      project: ProjectResolve
    },
    children: [
      { path: '', component: SettingsComponent }
    ]
  },
  {
    path: ':id',
    redirectTo: '/projects/:id/overview/settings',
    pathMatch: 'full'
  },
  {
    path: ':id/overview',
    redirectTo: '/projects/:id/overview/settings',
    pathMatch: 'full'
  },
  {
    path: ':id',
    data: { projectSideNav: true },
    resolve: {
      project: ProjectResolve
    },
    children: [
      {
        path: 'overview',
        component: OverviewComponent,
        children: [
          { path: 'settings', component: SettingsComponent },
          { path: 'tags', component: TagsComponent },
          { path: 'audits', component: AuditsComponent }
        ]
      },
      { path: 'tasks', pathMatch: 'full', component: TasksComponent },
      { path: 'tasks/:id/audits', component: ProjectsTaskAuditsListComponent,
        resolve: {
          task: TaskResolve
        }
      },
      {
        path: 'docs',
        component: DocsComponent,
      },
      {
        path: 'images',
        component: ImagesComponent,
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectRoutingModule { }
