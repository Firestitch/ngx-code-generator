import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared';

import { StatusPillModule } from '@libs/pills/status';

import {
  ObjectVersionItemComponent,
  ObjectVersionListComponent,
  ObjectVersionsComponent
} from './components';


@NgModule({
  imports: [
    SharedModule,
    StatusPillModule,
  ],
  declarations: [
    ObjectVersionsComponent,
    ObjectVersionListComponent,
    ObjectVersionItemComponent,
  ],
  exports: [
    ObjectVersionsComponent,
  ],
})
export class ObjectVersionsModule {

}
