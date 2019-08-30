import { NgModule } from '@angular/core';

import { SharedModule } from '../../../shared';
import {
  ContentsComponent,
  ContentComponent
} from '.';
import { AdminSharedModule } from '../shared/admin-shared.module';
import { ContentRoutingModule } from './content-routing.module';



@NgModule({
  imports: [
    SharedModule,
    AdminSharedModule,
    ContentRoutingModule
  ],
  declarations: [
    ContentsComponent,
    ContentComponent
  ],
  entryComponents: [
    ContentComponent
  ]
})
export class ContentModule {
}
