import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '@app/shared';
import { SigninComponent, PasswordChangeComponent } from './';

import { FsPasswordModule } from '@firestitch/password';
import { OrLineModule } from '@libs/or-line';
import { SocialButtonModule } from '@libs/social-button';

import { SigninRoutingModule } from './signin-routing.module';

@NgModule({
  imports: [
    SharedModule,
    RouterModule,
    FsPasswordModule,
    SigninRoutingModule,
    OrLineModule,
    SocialButtonModule,
  ],
  declarations: [
    SigninComponent,
    PasswordChangeComponent
  ],
  entryComponents: [

  ],
  exports: []
})
export class SigninModule {
}
