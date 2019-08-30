import { NgModule } from '@angular/core';

import { FsModelModule } from '@firestitch/model';
import { FsZoomPanModule } from '@firestitch/zoom-pan';

import { SharedModule } from '@app/shared';
import { AccountAssignToMenuModule } from '@libs/account/assign-to-menu';
import { CategoryPillModule } from '@libs/pills/category';
import { StatusPillModule } from '@libs/pills/status';
import { TypePillModule } from '@libs/pills/type';
import { SubscribersModule } from '@libs/subscribers';

import {
  TypesListComponent,
  StatusesListComponent,
  StatusComponent,
  CategoriesListComponent,
  CategoryComponent,
  WorkflowStepComponent,
  WorkflowPathComponent,
  WorkflowPathEditActionComponent,
  FieldConfigComponent,
  AccountRoleComponent,
  WorkflowEditTaskComponent,
  WorkspacesBadgeListComponent,
} from './components';

import { AccountResolve, WorkflowResolve, TypeResolve } from './resolves';


@NgModule({
  imports: [
    FsModelModule,
    FsZoomPanModule,
    SharedModule,
    AccountAssignToMenuModule,
    CategoryPillModule,
    StatusPillModule,
    TypePillModule,
    SubscribersModule,
  ],
  declarations: [
    TypesListComponent,
    StatusesListComponent,
    StatusComponent,
    CategoriesListComponent,
    CategoryComponent,
    WorkflowStepComponent,
    WorkflowPathComponent,
    WorkflowPathEditActionComponent,
    FieldConfigComponent,
    AccountRoleComponent,
    WorkflowEditTaskComponent,
    WorkspacesBadgeListComponent,

  ],
  entryComponents: [
    CategoryComponent,
    StatusComponent,
    WorkflowStepComponent,
    WorkflowPathComponent,
    WorkflowPathEditActionComponent,
    AccountRoleComponent,
    WorkflowEditTaskComponent
  ],
  providers: [
    AccountResolve,
    WorkflowResolve,
    TypeResolve
  ],
  exports: [
    TypesListComponent,
    StatusesListComponent,
    StatusComponent,
    CategoriesListComponent,
    CategoryComponent,
    WorkflowStepComponent,
    WorkflowPathComponent,
    WorkflowPathEditActionComponent,
    FieldConfigComponent,
    AccountRoleComponent,
    WorkflowEditTaskComponent,
    WorkspacesBadgeListComponent,
  ]
})
export class AdminSharedModule {
}
