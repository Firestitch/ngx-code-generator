import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClassifyPipe } from './classify.pipe';
import { DasherizePipe } from './dasherize.pipe';


@NgModule({
  imports: [CommonModule],
  declarations: [
    ClassifyPipe,
    DasherizePipe,
  ],
  exports: [
    ClassifyPipe,
    DasherizePipe,
  ],
})
export class UtilPipesModule {}
