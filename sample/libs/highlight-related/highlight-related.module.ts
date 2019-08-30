import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared';

import { HighlightRelatedComponent } from './components';


@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [
    HighlightRelatedComponent,
  ],
  exports: [
    HighlightRelatedComponent,
  ],
})
export class HighlightRelatedModule {}
