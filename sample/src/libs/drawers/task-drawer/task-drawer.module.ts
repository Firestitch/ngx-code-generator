import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared';

import { AccountAssignToMenuModule } from '@libs/account/assign-to-menu';
import { AccountImageModule } from '@libs/account/image';
import { RelatedObjectsModule } from '@libs/related-objects';
import { CategoryPillModule } from '@libs/pills/category';
import { PriorityPillModule } from '@libs/pills/priority';
import { ObjectVersionsModule } from '@libs/object-versions';
import { StatusPillModule } from '@libs/pills/status';
import { TypePillModule } from '@libs/pills/type';
import { StatusMenuModule } from '@libs/status-menu';
import { HighlightedRelatedViewModule } from '@libs/highlighted-related-view';
import { ObjectIdentifierModule } from '@libs/object-identifier';
import { RichTextModule } from '@libs/rich-text';
import { SubscribersModule } from '@libs/subscribers';
import { TypeMenuModule } from '@libs/type-menu';

import {
  TaskComponent,
  TaskManageSubscriptionsComponent,
  TaskInfoComponent,
  AuditsLogsComponent,
  AuditEditCommentComponent,
  CommentCreateComponent,
} from './components';


@NgModule({
  imports: [
    SharedModule,
    RelatedObjectsModule,
    AccountAssignToMenuModule,
    AccountImageModule,
    CategoryPillModule,
    PriorityPillModule,
    StatusPillModule,
    TypePillModule,
    ObjectVersionsModule,
    StatusMenuModule,
    ObjectIdentifierModule,
    HighlightedRelatedViewModule,
    RichTextModule,
    SubscribersModule,
    TypeMenuModule,
  ],
  declarations: [
    TaskComponent,
    TaskManageSubscriptionsComponent,
    TaskInfoComponent,
    AuditsLogsComponent,
    AuditEditCommentComponent,
    CommentCreateComponent,
  ],
  entryComponents: [
    TaskComponent,
    TaskManageSubscriptionsComponent,
    AuditEditCommentComponent
  ],
})
export class TaskDrawerModule {}

