import { MessageQueueState } from '../enums/message-queue-state.enum';


export const MessageQueueStates = [
  { name: 'Sent', value: MessageQueueState.Sent },
  { name: 'Queued', value: MessageQueueState.Queued },
  { name: 'Canceled', value: MessageQueueState.Canceled },
  { name: 'InvalidRecipients', value: MessageQueueState.InvalidRecipients },
  { name: 'Failed', value: MessageQueueState.Failed }
];
