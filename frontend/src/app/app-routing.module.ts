import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/generator', pathMatch: 'full' },
  {
    path: 'generator',
    loadChildren: './component-generator/component-generator.module#ComponentGeneratorModule',
  },
  {
    path: 'enums',
    loadChildren: './enums/enums.module#EnumsModule',
  },
  {
    path: 'consts',
    loadChildren: './consts/consts.module#ConstsModule',
  },
];


@NgModule({
  imports: [ RouterModule.forRoot(
    routes,
    {
      useHash: false,
      preloadingStrategy: PreloadAllModules,
    })
  ],
  exports: [ RouterModule ],
})
export class AppRoutingModule {}
