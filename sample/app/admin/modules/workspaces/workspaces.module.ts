import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared';
import { WorkspaceCreateDialogModule } from '@libs/dialogs/workspace-create';
import { InvitesListDialogModule } from '@libs/dialogs/invites-list';
import { WorkspacesComponent } from './views';
import { WorkspacesRoutingModule } from './workspaces-routing.module';
import { AdminSharedModule } from '../shared/admin-shared.module';

@NgModule({
  imports: [
    SharedModule,
    AdminSharedModule,
    WorkspacesRoutingModule,
    WorkspaceCreateDialogModule,
    InvitesListDialogModule,
  ],
  declarations: [
    WorkspacesComponent
  ]
})
export class WorkspacesModule {
}
