import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/generator', pathMatch: 'full' },
  {
    path: 'generator',
    loadChildren: () => import('./component-generator/component-generator.module').then(m => m.ComponentGeneratorModule),
  },
  {
    path: 'enums',
    loadChildren: () => import('./enums/enums.module').then(m => m.EnumsModule),
  },
  {
    path: 'consts',
    loadChildren: () => import('./consts/consts.module').then(m => m.ConstsModule),
  },
  {
    path: 'interfaces',
    loadChildren: () => import('./interfaces/interfaces.module').then(m => m.InterfacesModule),
  }
];


@NgModule({
  imports: [ RouterModule.forRoot(
    routes,
    {
    useHash: false,
    preloadingStrategy: PreloadAllModules,
    relativeLinkResolution: 'legacy'
})
  ],
  exports: [ RouterModule ],
})
export class AppRoutingModule {}
