import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared';
import { RelatedObjectsModule } from '@libs/related-objects';
import { ObjectIdentifierModule } from '@libs/object-identifier';
import { HighlightedRelatedViewModule } from '@libs/highlighted-related-view';
import { RichTextModule } from '@libs/rich-text';

import { ImageComponent } from './components';


@NgModule({
  imports: [
    SharedModule,
    RelatedObjectsModule,
    ObjectIdentifierModule,
    HighlightedRelatedViewModule,
    RichTextModule,
  ],
  declarations: [
    ImageComponent,
  ],
  entryComponents: [
    ImageComponent,
  ],
})
export class ImageDrawerModule {}

