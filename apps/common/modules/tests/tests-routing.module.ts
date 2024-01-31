import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SssssComponent } from './views';


const routes: Routes = [
  { path: '', component: SssssComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule,
  ],
})
export class TestsRoutingModule { }
