import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared';
import { RichTextComponent } from './components';


@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [
    RichTextComponent,
  ],
  exports: [
    RichTextComponent,
  ],
})
export class RichTextModule {}
