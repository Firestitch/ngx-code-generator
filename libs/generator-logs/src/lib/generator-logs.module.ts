import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GeneratorLogsComponent } from './components/generator-logs/generator-logs.component';
import { HighlightStatusDirective } from './directives/highlight-status.directive';


@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    GeneratorLogsComponent,

    HighlightStatusDirective,
  ],
  exports: [
    GeneratorLogsComponent,
  ]
})
export class GeneratorLogsModule {}
