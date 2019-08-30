import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FsPasswordModule } from '@firestitch/password';

import { SharedModule } from '@app/shared';
import { OrLineModule } from '@libs/or-line';
import { SocialButtonModule } from '@libs/social-button';

import { ContentWidgetComponent, ContentWidgetDialogComponent } from './components';
import { SignupComponent, ProfileComponent } from './views';
import { SignupRoutingModule } from './signup-routing.module';

@NgModule({
  imports: [
    SharedModule,
    RouterModule,
    FsPasswordModule,
    SignupRoutingModule,
    OrLineModule,
    SocialButtonModule,
  ],
  declarations: [
    SignupComponent,
    ProfileComponent,
    ContentWidgetComponent,
    ContentWidgetDialogComponent,
  ],
  exports: [],
  entryComponents: [
    ContentWidgetDialogComponent,
  ]
})
export class SignupModule {

}
