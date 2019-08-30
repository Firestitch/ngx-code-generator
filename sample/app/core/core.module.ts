/**
 * Core module it's a main module in project after AppModule.
 * This module contain providers initializations and usually all modules .forRoot() expressions
 * Core module can be imported only once and by this reason providers which has been declared here
 * will be a singleton across all project. (if they was not re-declared in some component)
 */
import { NgModule, Optional, SkipSelf, Injector } from '@angular/core';
import { Router } from '@angular/router';

import { LAZY_MAPS_API_CONFIG } from '@agm/core';
import { GoogleMapConfig } from './models/google-map.config';
import { DragulaModule } from 'ng2-dragula';

import {
  FS_API_REQUEST_INTERCEPTOR,
  FS_API_RESPONSE_HANDLER,
  FsApi,
  FsApiModule
} from '@firestitch/api';

import { FsCoreModule } from '@firestitch/core';
import { FsNavModule } from '@firestitch/nav';
import { FsStore, FsStoreModule } from '@firestitch/store';
import { FsBodyModule } from '@firestitch/body';
import { FsUploadModule } from '@firestitch/upload';
import { FsGalleryModule } from '@firestitch/gallery';
import { FsPasswordModule } from '@firestitch/password';
import { FsSelectionModule } from '@firestitch/selection';
import { FsDrawerModule } from '@firestitch/drawer';
import { FsFileModule } from '@firestitch/file';
import { GOOGLE_MAP_KEY } from '@firestitch/address';
import { FsListModule } from '@firestitch/list';
import { FsPromptModule } from '@firestitch/prompt';
import { FsFormModule } from '@firestitch/form';
import { FsFieldEditorModule } from '@firestitch/field-editor';
import { FsScrollbarModule } from '@firestitch/scrollbar';

import { FsScrollModule } from '@firestitch/scroll';

import { FsMessage, FsMessageModule } from '@firestitch/message';
import { FsEditorRendererModule, FsEditorRichTextModule } from '@firestitch/editor';
import { FsAutocompleteChipsModule } from '@firestitch/autocomplete-chips';
import { FsAttributeModule, FS_ATTRIBUTE_CONFIG } from '@firestitch/attribute';
import { FS_TRANSFER_HANDLER, FsTransferService } from '@firestitch/transfer';
import { FsPrompt } from '@firestitch/prompt';
import { FsDatePickerModule } from '@firestitch/datepicker';
import { FsPhoneModule } from '@firestitch/phone';
import { FsDialogModule } from '@firestitch/dialog';

import { ToastrModule } from 'ngx-toastr';
import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { MultiWindowModule } from 'ngx-multi-window';

import {
  AccountData,
  SessionService,
  AuthService,
  AuditData,
  ObjectService,
  TypeData,
  AttributeData,
  CategoryData,
  StatusData,
  WorkflowData,
  ProjectData,
  AssetData,
  DocData,
  NavService,
  FieldData,
  AclEntryData,
  AclQueryService,
  TaskData,
  RoleData,
  InviteData,
  ActivationData,
  WorkspaceData,
  AclRoleData,
  AclRoleService,
  CommentData,
  SocialAuthService,
  SignupService,
  SigninService,
  ImageData,
  TimezoneData,
  EnvironmentData,
  ContentData,
  ObjectFilterService,
  InviteService,
  ObjectData,
  MessageService
  } from './';

import { ApiHandler, TransferHandler } from './handlers';
import { ApiInterceptorFactory } from './interceptors';
import { attributeConfigFactory } from './helpers/attribute-config-factory';
import { jwtOptionsFactory } from './helpers/jwt-options-factory';
import { ListDefaultConfig } from './consts';
import { throwIfAlreadyLoaded } from './helpers';
import { AttributeService } from './services';
import { FsBuildModule } from '@firestitch/build';
import { environment } from 'environments/environment';

import { DocDrawerModule } from '@libs/drawers/doc-drawer';
import { TaskDrawerModule } from '@libs/drawers/task-drawer';
import { ImageDrawerModule } from '@libs/drawers/image-drawer';
import { DrawerModule } from '@libs/drawers/drawer';
import {
  AuthServiceConfig,
  FacebookLoginProvider,
  GoogleLoginProvider
} from 'angularx-social-login';
import { MAT_DIALOG_DEFAULT_OPTIONS, MAT_LABEL_GLOBAL_OPTIONS } from '@angular/material';
import { TimeEntryModule } from '@app/time-entry';


@NgModule({
  imports: [
    FsApiModule.forRoot({
      maxFileConnections: 5
    }),
    FsStoreModule,
    LoadingBarHttpClientModule,
    MultiWindowModule.forRoot({
      newWindowScan: 1000
    }),
    FsPasswordModule.forRoot(),
    FsGalleryModule.forRoot(),
    FsMessageModule.forRoot(),
    FsSelectionModule.forRoot(),
    FsNavModule.forRoot(),
    FsCoreModule,
    ToastrModule.forRoot({ preventDuplicates: true }),
    FsListModule.forRoot(ListDefaultConfig),
    FsPromptModule.forRoot(),
    FsFormModule.forRoot(),
    FsFieldEditorModule.forRoot(),
    FsScrollModule.forRoot(),
    FsBodyModule.forRoot(),
    FsUploadModule.forRoot(),
    FsDrawerModule.forRoot(),
    FsFileModule.forRoot(),
    FsEditorRendererModule.forRoot(),
    FsEditorRichTextModule.forRoot(),
    FsAutocompleteChipsModule.forRoot(),
    FsAttributeModule.forRoot(),
    FsScrollbarModule.forRoot(),
    DragulaModule.forRoot(),
    FsBuildModule.forRoot({
      updateEnabled: !environment.production
    }),
    FsDatePickerModule.forRoot(),
    FsPhoneModule.forRoot(),
    FsDialogModule.forRoot(),
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
        deps: [FsStore]
      }
    }),

    DocDrawerModule,
    TaskDrawerModule,
    ImageDrawerModule,
    DrawerModule,
    TimeEntryModule
  ],
  providers: [
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: { maxWidth: '95vw', hasBackdrop: true }
    },
    {
      provide: MAT_LABEL_GLOBAL_OPTIONS,
      useValue: { float: 'auto' },
    },
    {
      provide: FS_TRANSFER_HANDLER,
      useClass: TransferHandler,
      deps: [ FsMessage, SessionService ]
    },
    {
      provide: FS_API_REQUEST_INTERCEPTOR,
      useFactory: ApiInterceptorFactory,
      deps: [ FsStore ]
    },
    {
      provide: FS_API_RESPONSE_HANDLER,
      useClass: ApiHandler,
      deps: [ FsMessage, Router, SigninService, SessionService, MessageService ]
    },
    {
      provide: LAZY_MAPS_API_CONFIG,
      useClass: GoogleMapConfig,
    },
    { provide: GOOGLE_MAP_KEY, useValue: 'AIzaSyAoT2RLzCSFUb148F4uLXyAuquAzjcjyGk' },
    {
      provide: AuthServiceConfig,
      useFactory: provideConfig
    },
    {
      provide: FS_ATTRIBUTE_CONFIG,
      useFactory: attributeConfigFactory,
      deps: [
        AttributeData,
        AttributeService,
        FsPrompt,
        FsMessage,
      ] },
    FsTransferService,
    FsApi,
    FsStore,
    SessionService,
    AuthService,
    AuditData,
    AccountData,
    TypeData,
    FieldData,
    AttributeData,
    CategoryData,
    StatusData,
    ObjectService,
    WorkflowData,
    RoleData,
    ProjectData,
    AssetData,
    DocData,
    NavService,
    AclEntryData,
    AclQueryService,
    TaskData,
    InviteData,
    ActivationData,
    WorkspaceData,
    AclRoleData,
    CommentData,
    SocialAuthService,
    SigninService,
    SignupService,
    ImageData,
    TimezoneData,
    EnvironmentData,
    ContentData,
    ObjectFilterService,
    AclRoleService,
    InviteService,
    ObjectData,
    AttributeService,
    MessageService
  ],
  exports: [
    LoadingBarHttpClientModule,
    FsBuildModule
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}

export function provideConfig() {
  return new AuthServiceConfig([
    {
      id: GoogleLoginProvider.PROVIDER_ID,
      provider: new GoogleLoginProvider(environment.googleClientId)
    },
    {
      id: FacebookLoginProvider.PROVIDER_ID,
      provider: new FacebookLoginProvider(environment.facebookAppId)
    }
  ]);
}
