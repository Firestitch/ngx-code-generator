import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import {
  DocsComponent,
  TypesComponent,
  TypeComponent,
  GeneralComponent,
  StatusesComponent
} from '.';
import { TypeResolve, FieldConfigComponent } from '../shared';


export const routes: Routes = [

  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/admin/docs/types'
  },
  {
    path: '',
    component: DocsComponent,
    children: [
      { path: 'types', component: TypesComponent },
      { path: 'statuses', component: StatusesComponent }
    ]
  },
  {
    path: 'type',
    component: TypeComponent,
    data: { class: 'doc' },
    resolve: {
      type: TypeResolve
    },
    children: [
      { path: '', component: GeneralComponent },
    ]
  },
  {
    path: 'type/:type_id',
    component: TypeComponent,
    data: { class: 'doc' },
    resolve: {
      type: TypeResolve
    },
    children: [
      { path: '', component: GeneralComponent },
      { path: 'fields', component: FieldConfigComponent }
    ]
  }
];


@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class DocsRoutingModule {

}
