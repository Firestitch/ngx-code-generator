import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared';
import { StatusPillModule } from '@libs/pills/status';

import { ProjectsRoutingModule } from './projects-routing.module';
import { ProjectSharedModule } from './modules/project/modules/shared/shared.module';
import {
  TasksComponent,
  ProjectsComponent,
} from './views';


@NgModule({
  imports: [
    ProjectsRoutingModule,
    SharedModule,
    ProjectSharedModule,
    StatusPillModule,
  ],
  declarations: [
    ProjectsComponent,
    TasksComponent
  ],
  providers: []
})
export class ProjectsModule { }
