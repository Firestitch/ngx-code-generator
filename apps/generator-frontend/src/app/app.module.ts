import { NgModule } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserModule } from '@angular/platform-browser';

import { FakeBackendModule } from '@codegenerator/fake-backend';

import { environment } from '../environments/environment';

import { CoreModule } from './core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    MatTabsModule
    ,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
