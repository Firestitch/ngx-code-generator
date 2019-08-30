import { NgModule } from '@angular/core';

import { FsModelModule } from '@firestitch/model';
import { FsZoomPanModule } from '@firestitch/zoom-pan';

import {
  TasksComponent,
  TypesComponent,
  TypeComponent,
  CategoriesComponent,
  StatusesComponent,
  WorkflowsComponent,
  WorkflowComponent,
  GeneralComponent,
  DesignComponent,
} from '.';
import { AdminSharedModule } from '../shared/admin-shared.module';
import { TasksRoutingModule } from './tasks-routing.module';
import { SharedModule } from '@app/shared';
import { StatusPillModule } from '@libs/pills/status';



@NgModule({
  imports: [
    SharedModule,
    AdminSharedModule,
    TasksRoutingModule,
    FsModelModule,
    FsZoomPanModule,
    StatusPillModule,
  ],
  declarations: [
    TasksComponent,
    TypesComponent,
    TypeComponent,
    CategoriesComponent,
    StatusesComponent,
    WorkflowsComponent,
    WorkflowComponent,
    GeneralComponent,
    DesignComponent
  ],
  entryComponents: [
    TypeComponent
  ]
})
export class TasksModule {
}
