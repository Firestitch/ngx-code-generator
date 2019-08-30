import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared';
import { LastModifiedModule } from '@libs/last-modified';
import { AuditListModule } from '@libs/lists/audit-list';
import { StatusPillModule } from '@libs/pills/status';
import { StatusMenuModule } from '@libs/status-menu';
import { TypePillModule } from '@libs/pills/type';
import { ObjectIdentifierModule } from '@libs/object-identifier';

import { ProjectRoutingModule } from './project-routing.module';
import { ProjectResolve } from './resolves';
import { ProjectSharedModule } from './modules/shared/shared.module';
import {
  OverviewComponent,
  SettingsComponent,
  TagsComponent,
  AuditsComponent,
  DocsComponent,
  ImagesComponent,
  TasksComponent,
} from '.';


@NgModule({
  imports: [
    SharedModule,
    ProjectRoutingModule,
    ProjectSharedModule,
    LastModifiedModule,
    AuditListModule,
    StatusPillModule,
    TypePillModule,
    StatusMenuModule,
    ObjectIdentifierModule,
  ],
  declarations: [
    OverviewComponent,
    SettingsComponent,
    TagsComponent,
    AuditsComponent,
    DocsComponent,
    ImagesComponent,
    TasksComponent,
  ],
  providers: [
    ProjectResolve
  ],
  entryComponents: [
  ],
  exports: [
    ProjectSharedModule,
  ]
})
export class ProjectModule { }
