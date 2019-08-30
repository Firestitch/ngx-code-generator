import { NgModule } from '@angular/core';
import { DrawerFactory, ObjectDrawerService } from './services';



@NgModule({
  providers: [
    DrawerFactory,
    ObjectDrawerService
  ],
})
export class DrawerModule {}

