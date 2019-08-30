import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared';

import { AccountAssignPillModule } from '@libs/account/assign-pill';
import { PriorityPillModule } from '@libs/pills/priority';
import { StatusPillModule } from '@libs/pills/status';
import { GlobalSearchModule } from '@libs/global-search';
import { ObjectIdentifierModule } from '@libs/object-identifier';
import { HighlightRelatedModule } from '@libs/highlight-related';

import {
  RelatedObjectPreviewComponent,
  RelatedObjectCreateMenuComponent,
  RelateExistedObjectDialogComponent,
  RelatedObjectsComponent,
  DocPreviewComponent,
  TaskPreviewComponent,
  AssetPreviewComponent,
} from './components/related-objects';
import { TaskCreateComponent, DocCreateComponent } from './components';


@NgModule({
  imports: [
    SharedModule,
    AccountAssignPillModule,
    PriorityPillModule,
    StatusPillModule,
    GlobalSearchModule,
    ObjectIdentifierModule,
    HighlightRelatedModule,
  ],
  declarations: [
    RelatedObjectsComponent,
    RelatedObjectCreateMenuComponent,
    RelateExistedObjectDialogComponent,
    RelatedObjectPreviewComponent,
    DocPreviewComponent,
    TaskPreviewComponent,
    AssetPreviewComponent,
    TaskCreateComponent,
    DocCreateComponent,
  ],
  entryComponents: [
    TaskCreateComponent,
    DocCreateComponent,
    RelateExistedObjectDialogComponent
  ],
  exports: [
    RelatedObjectsComponent,
  ]
})
export class RelatedObjectsModule {}
