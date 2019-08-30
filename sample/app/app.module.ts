/**
 * App can be named as RootModule, it has includes/imports of all project modules as a dependency.
 * Usually it doesn't contain any providers and providers are placed in Core
 */
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { CoreModule } from './core/core.module';
import { SharedModule } from './shared';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { AdminGuard, LoggedInGuard, LoggedOutGuard } from './shared/guards';
import { SearchModule } from './search/search.module';
import { ProjectsModule } from './projects/projects.module';
import { SideNavModule } from '@libs/layouts/side-nav';
import { CardModule } from '@libs/layouts/card';
import { HomeRootComponent } from '@libs/layouts/home-root';


@NgModule({
  declarations: [
    AppComponent,
    HomeRootComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    CoreModule,
    SharedModule,
    HttpClientModule,
    SearchModule,
    ProjectsModule,
    CardModule,
    SideNavModule,
  ],
  providers: [
    LoggedInGuard,
    LoggedOutGuard,
    AdminGuard
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {
}
