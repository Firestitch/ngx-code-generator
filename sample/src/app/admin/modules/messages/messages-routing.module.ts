import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
  MessagesComponent,
  TabsComponent,
  QueuesComponent,
  TemplatesComponent
} from '.';


export const routes: Routes = [
  {
    path: '',
    component: TabsComponent,
    children: [
      { path: '', component: MessagesComponent, pathMatch: 'full' },
      { path: 'templates', component: TemplatesComponent },
      { path: 'queues', component: QueuesComponent }
    ]
  }
];


@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class MessagesRoutingModule {

}
