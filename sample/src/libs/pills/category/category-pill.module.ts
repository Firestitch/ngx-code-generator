import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared';

import { CategoryPillComponent } from './components';


@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [
    CategoryPillComponent,
  ],
  exports: [
    CategoryPillComponent,
  ]
})
export class CategoryPillModule {}
