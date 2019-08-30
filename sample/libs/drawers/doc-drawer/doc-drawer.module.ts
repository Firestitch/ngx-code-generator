import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared';
import { RelatedObjectsModule } from '@libs/related-objects';
import { ObjectVersionsModule } from '@libs/object-versions';
import { StatusMenuModule } from '@libs/status-menu';
import { ObjectIdentifierModule } from '@libs/object-identifier';
import { HighlightedRelatedViewModule } from '@libs/highlighted-related-view';
import { TypeMenuModule } from '@libs/type-menu';

import { DocComponent, DocInfoComponent, FieldEditComponent, } from './components';


@NgModule({
  imports: [
    SharedModule,
    RelatedObjectsModule,
    ObjectVersionsModule,
    StatusMenuModule,
    ObjectIdentifierModule,
    HighlightedRelatedViewModule,
    TypeMenuModule,
  ],
  declarations: [
    DocComponent,
    DocInfoComponent,
    FieldEditComponent,
  ],
  entryComponents: [
    DocComponent,
    FieldEditComponent,
  ],
})
export class DocDrawerModule {
}

