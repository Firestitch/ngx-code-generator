import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared';

import { ObjectIdentifierModule } from '@libs/object-identifier';

import { HighlightedRelatedViewComponent } from './components';


@NgModule({
  imports: [
    SharedModule,
    ObjectIdentifierModule,
  ],
  declarations: [
    HighlightedRelatedViewComponent,
  ],
  exports: [
    HighlightedRelatedViewComponent,
  ],
})
export class HighlightedRelatedViewModule {}
