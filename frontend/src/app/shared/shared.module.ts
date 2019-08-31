import { NgModule, Optional, SkipSelf } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MatFormFieldModule, MatInputModule, MatProgressSpinnerModule,
  MatSelectModule, MatButtonModule, MatCardModule, MatIconModule,
  MatDialogModule, MatCheckboxModule, MatTabsModule
} from '@angular/material';

import { FsAutocompleteModule } from '@firestitch/autocomplete';

import { throwIfAlreadyLoaded } from '../core/module-import-guard';

import {
  BasicPatternComponent,
  CreateEditComponent,
  GeneratorPreviewComponent,
} from './generator-preview';
import { GeneratorLogsComponent, HighlightStatusDirective } from './generator-logs';
import { GeneratorCodeComponent } from './generator-code';
import { DasherizePipe, ClassifyPipe } from './shared';
import { CommonModule } from '@angular/common';
import { FsLabelModule } from '@firestitch/label';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatCheckboxModule,
    MatTabsModule,
    FsAutocompleteModule,
    FsLabelModule,
  ],
  declarations: [
    GeneratorPreviewComponent,
    GeneratorLogsComponent,
    GeneratorCodeComponent,
    BasicPatternComponent,
    CreateEditComponent,
    HighlightStatusDirective,
    DasherizePipe,
    ClassifyPipe,
  ],
  exports: [
    CommonModule,
    FormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatCheckboxModule,
    MatTabsModule,

    FsAutocompleteModule,
    FsLabelModule,

    GeneratorPreviewComponent,
    GeneratorLogsComponent,
    GeneratorCodeComponent,
    HighlightStatusDirective,
    DasherizePipe,
    ClassifyPipe,
  ]
})
export class SharedModule {
  constructor( @Optional() @SkipSelf() parentModule: SharedModule) {
    throwIfAlreadyLoaded(parentModule, 'SharedModule');
  }
}
