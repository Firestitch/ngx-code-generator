/**
 * Shared module must contain modules/components/directives/etc. which must have a possibility to use everywhere in project
 * As example it can be RouterModule, Material Modules, Some components like "Follow" button
 * !!!Shared module CAN NOT CONTAIN SERVICES!!!
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { FsCommonModule } from '@firestitch/common';
import { FsCheckboxGroupModule } from '@firestitch/checkboxgroup';
import { FsBadgeModule } from '@firestitch/badge';
import { FsListModule } from '@firestitch/list';
import { FsPromptModule } from '@firestitch/prompt';
import { FsFormModule } from '@firestitch/form';
import { FsFieldEditorModule } from '@firestitch/field-editor';
import { FsDateModule } from '@firestitch/date';
import { FsDatePickerModule } from '@firestitch/datepicker';
import { FsNavModule } from '@firestitch/nav';
import { FsSkeletonModule } from '@firestitch/skeleton';
import { FsFilterModule } from '@firestitch/filter';
import { FsFileModule } from '@firestitch/file';
import { FsGalleryModule } from '@firestitch/gallery';
import { FsColorPickerModule } from '@firestitch/colorpicker';
import { FsMenuModule } from '@firestitch/menu';
import { FsIconPickerModule } from '@firestitch/icon-picker';
import { FsAccountStatusModule } from '@firestitch/account-status';
import { FsSigninSecurityModule } from '@firestitch/signin-security';
import { FsPasswordModule } from '@firestitch/password';
import { FsDurationModule } from '@firestitch/duration';
import { FsRadioGroupModule } from '@firestitch/radiogroup';
import { FsAddressModule } from '@firestitch/address';
import { FsAttributeModule } from '@firestitch/attribute';
import { FsPhoneModule } from '@firestitch/phone';
import { FsLabelModule } from '@firestitch/label';
import { FsChipModule } from '@firestitch/chip';
import { FsFileManagerModule } from '@firestitch/file-manager';
import { FsEditorRichTextModule, FsEditorRendererModule } from '@firestitch/editor';
import { FsAutocompleteChipsModule } from '@firestitch/autocomplete-chips';
import { FsDialogModule } from '@firestitch/dialog';
import { FsAutocompleteModule } from '@firestitch/autocomplete';
import { FsDrawerModule } from '@firestitch/drawer';
import { FsScrollModule } from '@firestitch/scroll';

import { SocialLoginModule } from 'angularx-social-login';
import { AppMaterialModule } from '@libs/material';


@NgModule({
  imports: [
    RouterModule,
    CommonModule,
    DragDropModule,
    FormsModule,
    FlexLayoutModule,
    FsBadgeModule,
    FsCommonModule,
    AppMaterialModule,
    FsDateModule,
    FsNavModule,
    FsSkeletonModule,
    FsFilterModule,
    FsFileModule,
    FsGalleryModule,
    FsColorPickerModule,
    FsCheckboxGroupModule,
    FsAccountStatusModule,
    FsSigninSecurityModule,
    FsPasswordModule,
    FsRadioGroupModule,
    FsMenuModule,
    FsIconPickerModule,
    FsDurationModule,
    FsAddressModule,
    FsListModule,
    FsPromptModule,
    FsFormModule,
    FsFieldEditorModule,
    FsAttributeModule,
    FsScrollModule,
    FsLabelModule,
    FsChipModule,
    FsDrawerModule,
    FsEditorRichTextModule,
    FsEditorRendererModule,
    SocialLoginModule,
    FsAutocompleteChipsModule,
    FsAutocompleteModule,
    FsFileManagerModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    RouterModule,
    DragDropModule,
    FlexLayoutModule,
    FsCommonModule,
    AppMaterialModule,
    FsListModule,
    FsFormModule,
    FsFieldEditorModule,
    FsCheckboxGroupModule,
    FsAccountStatusModule,
    FsSigninSecurityModule,
    FsPasswordModule,
    FsRadioGroupModule,
    FsDateModule,
    FsBadgeModule,
    FsScrollModule,
    FsColorPickerModule,
    FsDatePickerModule,
    FsFileModule,
    FsGalleryModule,
    FsNavModule,
    FsSkeletonModule,
    FsFilterModule,
    FsMenuModule,
    FsColorPickerModule,
    FsIconPickerModule,
    FsDurationModule,
    FsAddressModule,
    FsPhoneModule,
    FsLabelModule,
    FsChipModule,
    FsDrawerModule,
    FsEditorRendererModule,
    FsEditorRichTextModule,
    FsAutocompleteChipsModule,
    FsAttributeModule,
    FsDialogModule,
    FsSkeletonModule,
    FsFilterModule,
    FsMenuModule,
    FsColorPickerModule,
    FsIconPickerModule,
    FsFileManagerModule
  ]
})
export class SharedModule {
}
