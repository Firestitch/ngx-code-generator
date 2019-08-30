import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared';
import { ProjectImageComponent } from './components';


@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [
    ProjectImageComponent,
  ],
  exports: [
    ProjectImageComponent,
  ],
})
export class ProjectImageModule {}
