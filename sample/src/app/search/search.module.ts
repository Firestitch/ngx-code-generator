import { NgModule } from '@angular/core';
import { GlobalSearchModule } from '@libs/global-search';
import { ObjectIdentifierModule } from '@libs/object-identifier';

import { SharedModule } from '../shared';
import { SearchRoutingModule } from './search-routing.module';
import {
  SearchDialogComponent,
  SearchComponent
} from './';


@NgModule({
  imports: [
    SearchRoutingModule,
    SharedModule,
    GlobalSearchModule,
    ObjectIdentifierModule,
  ],
  declarations: [
    SearchDialogComponent,
    SearchComponent,
  ],
  entryComponents: [SearchDialogComponent],
  exports: [
    SearchDialogComponent,
  ]
})
export class SearchModule { }
