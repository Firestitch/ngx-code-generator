import { NgModule } from '@angular/core';
import { FsPasswordModule } from '@firestitch/password';

import { AccountFormModule } from '@libs/account/form';

import { SharedModule } from '../shared';
import { OverviewComponent } from './views';

import { TabsComponent } from './components';
import { AccountRoutingModule } from './account-routing.module';


@NgModule({
  imports: [
    SharedModule,
    AccountRoutingModule,
    AccountFormModule,
    FsPasswordModule.forRoot()
  ],
  declarations: [
    TabsComponent,
    OverviewComponent,
  ],
})
export class AccountModule {
}
