import { NgModule } from '@angular/core';

import { CoreRoutingModule } from './core-routing.module';
import { ProjectsComponent, DogsComponent } from './views';
import { FsListModule } from '@firestitch/list';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FsDialogModule } from '@firestitch/dialog';
import { FsFormModule } from '@firestitch/form';
import { FsSkeletonModule } from '@firestitch/skeleton';
import { ProjectComponent, DogComponent } from './components';


@NgModule({
  imports: [
    CoreRoutingModule,
    FsListModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    FsDialogModule,
    FsFormModule,
    FsSkeletonModule,
  ],
  declarations: [
  ProjectsComponent,
  ProjectComponent,
  DogsComponent,
  DogComponent],
})
export class CoreModule { }
