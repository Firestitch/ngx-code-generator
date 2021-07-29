import { ModuleWithProviders, NgModule } from '@angular/core';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { ApiService } from './services/api.service';

@NgModule()
export class FakeBackendModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: FakeBackendModule,
      providers: [
        HttpClientInMemoryWebApiModule
          .forRoot(
            ApiService,
            {
              apiBase: 'api/'
            }
          )
          .providers,
      ],
    };
  }
}
