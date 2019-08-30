import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import {
  ProjectsTasksListComponent,
  ProjectsTaskAuditsListComponent,
  ProjectsDocAuditsComponent,
} from './components';

import { DueDateExpiredDirective } from './directives';

import { TaskResolve } from './resolves';
import { SharedModule } from '@app/shared';
import { LastModifiedModule } from '@libs/last-modified';
import { AuditListModule } from '@libs/lists/audit-list';
import { AccountImageModule } from '@libs/account/image';
import { PriorityPillModule } from '@libs/pills/priority';
import { StatusPillModule } from '@libs/pills/status';
import { TypePillModule } from '@libs/pills/type';
import { ObjectIdentifierModule } from '@libs/object-identifier';
import { ProjectImageModule } from '@libs/project-image';

@NgModule({
  imports: [
    RouterModule,
    SharedModule,
    LastModifiedModule,
    AuditListModule,
    AccountImageModule,
    PriorityPillModule,
    StatusPillModule,
    TypePillModule,
    ObjectIdentifierModule,
    ProjectImageModule,
  ],
  declarations: [
    ProjectsTasksListComponent,
    ProjectsTaskAuditsListComponent,
    ProjectsDocAuditsComponent,
    DueDateExpiredDirective,
  ],
  exports: [
    ProjectsTasksListComponent,
    ProjectsTaskAuditsListComponent,
    ProjectsDocAuditsComponent,
    DueDateExpiredDirective,
  ],
  providers: [TaskResolve]
})

  export class ProjectSharedModule {
}
