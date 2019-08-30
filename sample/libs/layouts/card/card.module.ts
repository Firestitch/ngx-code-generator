import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FsBuildModule } from '@firestitch/build';

import { SharedModule } from '@app/shared';

import { CardComponent } from './components';


@NgModule({
  imports: [
    RouterModule,
    FsBuildModule,
    SharedModule,
  ],
  declarations: [
    CardComponent,
  ],
  exports: [
    CardComponent,
  ]
})
export class CardModule {}
