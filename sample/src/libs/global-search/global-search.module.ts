import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared';
import { ObjectIdentifierModule } from '@libs/object-identifier';
import { HighlightRelatedModule } from '@libs/highlight-related';
import { SubscribersModule } from '@libs/subscribers';

import { GlobalSearchComponent, SubsearchComponent } from './components';


@NgModule({
  imports: [
    SharedModule,
    ObjectIdentifierModule,
    HighlightRelatedModule,
    SubscribersModule,
  ],
  declarations: [
    GlobalSearchComponent,
    SubsearchComponent,
  ],
  exports: [
    GlobalSearchComponent,
  ]
})
export class GlobalSearchModule {}
