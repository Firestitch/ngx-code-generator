import { NgModule } from '@angular/core';

import { FsSidenavModule } from '@firestitch/sidenav';

import { SharedModule } from '@app/shared';
import { SearchModule } from '@app/search/search.module';

import { WorkspaceCreateDialogModule } from '@libs/dialogs/workspace-create';
import { TimerModule } from '@libs/timer';

import {
  SearchProjectComponent,
  SideNavComponent,
  EnvironmentSwitchComponent,
  EnvironmentMenuComponent,
  HeaderComponent,
  NavbarComponent,
} from './components';


@NgModule({
  imports: [
    SharedModule,
    FsSidenavModule,
    WorkspaceCreateDialogModule,
    SearchModule,
    TimerModule,
  ],
  declarations: [
    SearchProjectComponent,
    SideNavComponent,
    EnvironmentSwitchComponent,
    EnvironmentMenuComponent,
    HeaderComponent,
    NavbarComponent,
  ],
  exports: [
    SideNavComponent,
    HeaderComponent,
  ],
  entryComponents: [
    SearchProjectComponent,
    EnvironmentMenuComponent,
    EnvironmentSwitchComponent,
  ]
})
export class SideNavModule {}
