import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared';
import { ObjectIdentifierModule } from '@libs/object-identifier';
import { ProjectImageModule } from '@libs/project-image';

import {
  TimeEntriesComponent
} from './';
import { ReportsRoutingModule } from './reports-routing.module';


@NgModule({
  imports: [
    SharedModule,
    ReportsRoutingModule,
    ObjectIdentifierModule,
    ProjectImageModule,
  ],
  declarations: [
    TimeEntriesComponent
  ]
})
export class ReportsModule {
}
