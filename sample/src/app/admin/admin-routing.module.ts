import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'accounts'
  },
  {
    path: 'accounts',
    loadChildren: './modules/accounts/accounts.module#AccountsModule',
  },
  {
    path: 'content',
    loadChildren: './modules/content/content.module#ContentModule',
  },
  {
    path: 'docs',
    loadChildren: './modules/docs/docs.module#DocsModule',
  },
  {
    path: 'projects',
    loadChildren: './modules/projects/projects.module#ProjectsModule',
  },
  {
    path: 'tasks',
    loadChildren: './modules/tasks/tasks.module#TasksModule',
  },
  {
    path: 'workspaces',
    loadChildren: './modules/workspaces/workspaces.module#WorkspacesModule',
  },
  {
    path: 'messages',
    loadChildren: './modules/messages/messages.module#MessagesModule',
  },
  {
    path: 'system',
    loadChildren: '../system/system.module#SystemModule',
  },
  { path: '**', redirectTo: 'accounts' }
];


@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
