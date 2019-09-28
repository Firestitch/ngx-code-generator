import { NgModule, Optional, SkipSelf } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';

import { FsMessageModule } from '@firestitch/message';
import { FsProgressModule } from '@firestitch/progress';
import { FsPromptModule } from '@firestitch/prompt';

import { ToastrModule } from 'ngx-toastr';

import { throwIfAlreadyLoaded } from './module-import-guard';
import { ApiUrlInterceptor } from './interceptors';


@NgModule({
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    ToastrModule.forRoot({ preventDuplicates: true }),
    FsMessageModule.forRoot({
      toastTimeout: 3
    }),
    FsProgressModule.forRoot(),
    FsPromptModule.forRoot()
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ApiUrlInterceptor, multi: true }
  ],
})
export class CoreModule {
  constructor( @Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}
