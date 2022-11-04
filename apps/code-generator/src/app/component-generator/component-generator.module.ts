import { NgModule } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgArrayPipesModule } from 'ngx-pipes';

import { ModulesAutocompleteModule } from '@codegenerator/modules-autocomplete';
import { GeneratorPreviewModule } from '@codegenerator/generator-preview';
import { GeneratorLogsModule } from '@codegenerator/generator-logs';
import { ComponentGeneratorRoutingModule } from './component-generator-routing.module';
import { GeneratorView } from './views';
import { ServicesService } from './services';
import {
  CreateServiceDialogComponent,
  ServicesListComponent,
} from './components/services-list';
import { ServiceListItemPipe } from './pipes/service-list-item.pipe';
import { GeneratorFormComponent } from './components/generator-form/generator-form.component';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FsLabelModule } from '@firestitch/label';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { FsAutocompleteModule } from '@firestitch/autocomplete';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';

@NgModule({
    imports: [
        FormsModule,
        NgArrayPipesModule,
        GeneratorPreviewModule,
        GeneratorLogsModule,
        MatTooltipModule,
        ComponentGeneratorRoutingModule,
        MatButtonModule,
        MatFormFieldModule,
        MatCardModule,
        MatSelectModule,
        MatInputModule,
        FsLabelModule,
        FsAutocompleteModule,
        MatProgressSpinnerModule,
        MatDialogModule,
        MatTabsModule,
        MatCheckboxModule,
        CommonModule,
        ModulesAutocompleteModule,
    ],
    declarations: [
        GeneratorView,
        GeneratorFormComponent,
        ServicesListComponent,
        CreateServiceDialogComponent,
        ServiceListItemPipe,
    ],
    providers: [ServicesService]
})
export class ComponentGeneratorModule {}
