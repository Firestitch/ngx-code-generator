import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { HomeRootComponent } from '@libs/layouts/home-root';
import { CardComponent } from '@libs/layouts/card';
import { SideNavComponent } from '@libs/layouts/side-nav';
import { NotFoundComponent } from '@libs/not-found/components';
import { AdminGuard, LoggedInGuard } from '@app/shared/guards';


export const routes: Routes = [
  { path: '', redirectTo: '/projects', pathMatch: 'full' },
  {
    path: '',
    component: HomeRootComponent,
    canActivate: [ LoggedInGuard ],
    children: [
      {
        path: '',
        component: SideNavComponent,
        children: [
          { path: 'account', loadChildren: 'app/account/account.module#AccountModule' },
          { path: 'search', loadChildren: 'app/search/search.module#SearchModule' },
          { path: 'projects', loadChildren: 'app/projects/projects.module#ProjectsModule', },
          { path: 'reports', loadChildren: 'app/reports/reports.module#ReportsModule' },
          { path: 'workspace', loadChildren: 'app/environment/environment.module#EnvironmentModule' },
          {
            path: 'admin',
            loadChildren: 'app/admin/admin.module#AdminModule',
            canActivate: [ AdminGuard ],
          },
          {
            path: 'system',
            loadChildren: 'app/system/system.module#SystemModule',
            canActivate: [ AdminGuard ],
          },
        ]
      }
    ],
  },
  {
    path: '',
    component: CardComponent,
    children: [
      { path: 'password', loadChildren: 'app/password/password.module#PasswordModule' },
      {
        path: 'invite',
        loadChildren: 'app/invite/invite.module#InviteModule',
        data: { bodyClass: 'body-card' },
      },
      {
        path: 'activation',
        loadChildren: 'app/activate/activate.module#ActivateModule',
        data: { bodyClass: 'body-card' },
      },
      {
        path: 'signin',
        loadChildren: 'app/signin/signin.module#SigninModule',
        data: { bodyClass: 'body-card body-signin' },
      },
      {
        path: 'signup',
        loadChildren: 'app/signup/signup.module#SignupModule',
        data: { bodyClass: 'body-card body-signup' },
      },
    ]
  },
  {
    path: 'blank',
    component: CardComponent
  },
  {
    path: 'notfound',
    component: SideNavComponent,
    loadChildren: 'libs/not-found/not-found.module#NotFoundModule'
  },
  { path: '**', redirectTo: '/notfound' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
    routes,
    {
      useHash: (+document.location.port === 8080 || document.location.protocol === 'file:'),
      preloadingStrategy: PreloadAllModules,
    }
  )],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
