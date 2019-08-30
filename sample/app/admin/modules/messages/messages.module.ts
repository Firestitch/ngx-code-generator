import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared';

import {
  TabsComponent,
  MessagesComponent,
  MessageComponent,
  QueuesComponent,
  QueueComponent,
  TemplatesComponent,
  TemplateComponent
} from '.';

import { MessagesRoutingModule } from './messages-routing.module';
import { MessageQueueData, MessageData, MessageTemplateData } from './data';


@NgModule({
  imports: [
    SharedModule,
    MessagesRoutingModule,
  ],
  declarations: [
    TabsComponent,
    MessagesComponent,
    MessageComponent,
    QueuesComponent,
    QueueComponent,
    TemplatesComponent,
    TemplateComponent
  ],
  entryComponents: [
    MessageComponent,
    QueueComponent,
    TemplateComponent
  ],
  providers: [
    MessageData,
    MessageQueueData,
    MessageTemplateData
  ]
})
export class MessagesModule {
}
