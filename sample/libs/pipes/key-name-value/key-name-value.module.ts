import { NgModule } from '@angular/core';
import { KeyNameValuePipe } from './pipes/key-name-value.pipe';


@NgModule({
  declarations: [
    KeyNameValuePipe,
  ],
  exports: [
    KeyNameValuePipe,
  ],
})
export class KeyNameValueModule {}
