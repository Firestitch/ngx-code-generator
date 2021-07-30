import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatIconModule } from '@angular/material/icon';

import { GeneratorPreviewComponent } from './components/generator-preview.component';
import { CreateEditComponent } from './components/create-edit/create-edit.component';
import { BasicPatternComponent } from './components/basic-pattern/basic-pattern.component';
import { UtilPipesModule } from '@codegenerator/util-pipes';

@NgModule({
  imports: [
    CommonModule,

    UtilPipesModule,

    MatIconModule,
  ],
  declarations: [
    GeneratorPreviewComponent,
    CreateEditComponent,
    BasicPatternComponent,
  ],
  exports: [ GeneratorPreviewComponent ],
})
export class GeneratorPreviewModule {}
