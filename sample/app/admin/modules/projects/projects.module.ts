import { NgModule } from '@angular/core';

import {
  ProjectsComponent,
  StatusesComponent
} from './views';
import { AdminSharedModule } from '../shared/admin-shared.module';
import { SharedModule } from '@app/shared';
import { ProjectsRoutingModule } from './projects-routing.module';


@NgModule({
  imports: [
    SharedModule,
    AdminSharedModule,
    ProjectsRoutingModule
  ],
  declarations: [
    ProjectsComponent,
    StatusesComponent
  ]
})
export class ProjectsModule {
}
