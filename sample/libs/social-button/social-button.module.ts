import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared';
import { SocialButtonComponent, SocialButtonGroupComponent } from './components';


@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [
    SocialButtonComponent,
    SocialButtonGroupComponent
  ],
  exports: [
    SocialButtonComponent,
    SocialButtonGroupComponent
  ],
})
export class SocialButtonModule {}
